import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { 
  StreamSession, 
  StreamingPlatform, 
  StreamingStatus, 
  StreamQuality,
  StreamSettings,
  StreamAnalytics,
  StreamTemplate,
  StreamStats,
  StreamingCapability,
  StreamInvitation,
  StreamRecording
} from '@socialboost/types';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import { StreamControlDto } from './dto/stream-control.dto';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class StreamingService {
  private readonly logger = new Logger(StreamingService.name);
  private readonly activeStreams = new Map<string, any>();

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly dataSource: DataSource,
  ) {}

  async startStream(userId: string, createStreamDto: CreateStreamDto) {
    const { title, description, platforms, settings } = createStreamDto;

    // Validate platforms
    const validPlatforms = Object.values(StreamingPlatform);
    for (const platform of platforms) {
      if (!validPlatforms.includes(platform)) {
        throw new BadRequestException(`Invalid platform: ${platform}`);
      }
    }

    // Check user's streaming capabilities
    const capabilities = await this.getPlatformCapabilities();
    for (const platform of platforms) {
      const capability = capabilities.find(c => c.platform === platform);
      if (!capability?.supported) {
        throw new BadRequestException(`Platform ${platform} is not supported`);
      }
    }

    // Create stream session
    const session = await this.dataSource.transaction(async manager => {
      const session = manager.create(StreamSession, {
        userId,
        title,
        description,
        platforms: platforms.map(p => ({
          platform: p,
          isActive: true,
          viewerCount: 0,
          lastHeartbeat: new Date(),
        })),
        status: StreamingStatus.PREPARING,
        quality: settings.video?.quality || StreamQuality.HIGH,
        settings: {
          camera: settings.camera || {
            resolution: '1920x1080',
            frameRate: 30,
            facingMode: 'user',
            constraints: {},
          },
          audio: settings.audio || {
            enabled: true,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            volume: 1.0,
          },
          video: settings.video || {
            quality: StreamQuality.HIGH,
            bitrate: 5000,
            keyframeInterval: 2,
            aspectRatio: '16:9',
            filters: [],
          },
          privacy: settings.privacy || {
            visibility: 'public',
            allowComments: true,
            allowDuet: true,
            allowStitch: true,
            ageRestriction: false,
          },
          scheduling: settings.scheduling || {
            isScheduled: false,
            autoStart: false,
          },
        },
        analytics: {
          totalViews: 0,
          peakViewers: 0,
          averageViewDuration: 0,
          engagement: {
            likes: 0,
            comments: 0,
            shares: 0,
            reactions: {},
          },
          demographics: {
            ageGroups: {},
            genders: {},
            countries: {},
          },
          realTime: {
            currentViewers: 0,
            bandwidth: 0,
            droppedFrames: 0,
            latency: 0,
          },
        },
      });

      const savedSession = await manager.save(session);

      // Initialize platform connections
      for (const platform of platforms) {
        await this.initializePlatformConnection(savedSession.id, platform, manager);
      }

      return savedSession;
    });

    // Generate stream keys and URLs
    const streamData = await this.generateStreamCredentials(session.id, platforms);

    // Cache session data
    await this.cacheSession(session);

    // Start monitoring
    this.startStreamMonitoring(session.id);

    return {
      sessionId: session.id,
      streamKey: streamData.streamKey,
      rtmpUrl: streamData.rtmpUrl,
      platforms: session.platforms,
      webSocketUrl: `ws://localhost:3001/streaming/ws/${session.id}`,
    };
  }

  async stopStream(sessionId: string) {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new NotFoundException('Stream session not found');
    }

    // Update session status
    session.status = StreamingStatus.ENDED;
    session.endTime = new Date();
    if (session.startTime) {
      session.duration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000);
    }

    await this.dataSource.manager.save(session);

    // Stop platform connections
    for (const platform of session.platforms) {
      await this.stopPlatformConnection(sessionId, platform.platform);
    }

    // Clear cache
    await this.redis.del(`stream:${sessionId}`);

    // Stop monitoring
    this.stopStreamMonitoring(sessionId);

    return { success: true, message: 'Stream stopped successfully' };
  }

  async controlStream(sessionId: string, streamControlDto: StreamControlDto) {
    const { action, data } = streamControlDto;
    const session = await this.getSession(sessionId);

    if (!session || session.status !== StreamingStatus.LIVE) {
      throw new BadRequestException('Stream is not live');
    }

    switch (action) {
      case 'pause':
        await this.pauseStream(sessionId);
        break;
      case 'resume':
        await this.resumeStream(sessionId);
        break;
      case 'switch_camera':
        await this.switchCamera(sessionId, data);
        break;
      case 'toggle_audio':
        await this.toggleAudio(sessionId, data);
        break;
      case 'update_settings':
        await this.updateStreamSettings(sessionId, data);
        break;
      default:
        throw new BadRequestException(`Unknown action: ${action}`);
    }

    return { success: true, message: `Stream ${action} executed successfully` };
  }

  async getUserSessions(userId: string, limit = 20, offset = 0) {
    const sessions = await this.dataSource.getRepository(StreamSession)
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.platforms', 'platforms')
      .where('session.userId = :userId', { userId })
      .orderBy('session.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();

    return sessions;
  }

  async getSession(sessionId: string) {
    const session = await this.dataSource.getRepository(StreamSession)
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.platforms', 'platforms')
      .leftJoinAndSelect('session.analytics', 'analytics')
      .where('session.id = :sessionId', { sessionId })
      .getOne();

    return session;
  }

  async getUserStats(userId: string): Promise<StreamStats> {
    const sessions = await this.dataSource.getRepository(StreamSession)
      .createQueryBuilder('session')
      .where('session.userId = :userId', { userId })
      .getMany();

    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalViews = sessions.reduce((sum, s) => sum + s.analytics.totalViews, 0);
    const averageViewers = totalSessions > 0 ? totalViews / totalSessions : 0;
    const peakViewers = Math.max(...sessions.map(s => s.analytics.peakViewers));
    
    const totalEngagement = sessions.reduce((sum, s) => {
      const engagement = s.analytics.engagement;
      return sum + engagement.likes + engagement.comments + engagement.shares;
    }, 0);
    const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;

    // Platform breakdown
    const platformBreakdown = {} as any;
    Object.values(StreamingPlatform).forEach(platform => {
      const platformSessions = sessions.filter(s => 
        s.platforms.some(p => p.platform === platform && p.isActive)
      );
      platformBreakdown[platform] = {
        sessions: platformSessions.length,
        views: platformSessions.reduce((sum, s) => sum + s.analytics.totalViews, 0),
        viewers: platformSessions.reduce((sum, s) => sum + s.analytics.peakViewers, 0),
        engagement: platformSessions.length > 0 ? 
          platformSessions.reduce((sum, s) => {
            const engagement = s.analytics.engagement;
            return sum + engagement.likes + engagement.comments + engagement.shares;
          }, 0) / platformSessions.length : 0,
      };
    });

    // Monthly stats
    const monthlyStats = this.calculateMonthlyStats(sessions);

    return {
      totalSessions,
      totalDuration,
      totalViews,
      averageViewers,
      peakViewers,
      engagementRate,
      platformBreakdown,
      monthlyStats,
    };
  }

  async getPlatformCapabilities(): Promise<StreamingCapability[]> {
    return [
      {
        platform: StreamingPlatform.FACEBOOK,
        supported: true,
        maxDuration: 480, // 8 hours
        maxViewers: 10000,
        supportedQualities: [StreamQuality.LOW, StreamQuality.MEDIUM, StreamQuality.HIGH],
        features: ['comments', 'reactions', 'sharing', 'monetization'],
        requirements: {
          minFollowers: 0,
          verificationRequired: false,
          ageRestriction: 18,
        },
      },
      {
        platform: StreamingPlatform.INSTAGRAM,
        supported: true,
        maxDuration: 240, // 4 hours
        maxViewers: 50000,
        supportedQualities: [StreamQuality.LOW, StreamQuality.MEDIUM, StreamQuality.HIGH],
        features: ['comments', 'likes', 'sharing', 'duet', 'stitch'],
        requirements: {
          minFollowers: 0,
          verificationRequired: false,
          ageRestriction: 13,
        },
      },
      {
        platform: StreamingPlatform.YOUTUBE,
        supported: true,
        maxDuration: 720, // 12 hours
        maxViewers: null, // unlimited
        supportedQualities: [StreamQuality.LOW, StreamQuality.MEDIUM, StreamQuality.HIGH, StreamQuality.ULTRA],
        features: ['comments', 'likes', 'sharing', 'monetization', 'superchat'],
        requirements: {
          minFollowers: 0,
          verificationRequired: false,
          ageRestriction: 13,
        },
      },
      {
        platform: StreamingPlatform.TIKTOK,
        supported: true,
        maxDuration: 180, // 3 hours
        maxViewers: 100000,
        supportedQualities: [StreamQuality.LOW, StreamQuality.MEDIUM, StreamQuality.HIGH],
        features: ['comments', 'likes', 'sharing', 'duet', 'stitch', 'gifts'],
        requirements: {
          minFollowers: 1000,
          verificationRequired: false,
          ageRestriction: 16,
        },
      },
      {
        platform: StreamingPlatform.TWITCH,
        supported: true,
        maxDuration: 1440, // 24 hours
        maxViewers: null, // unlimited
        supportedQualities: [StreamQuality.LOW, StreamQuality.MEDIUM, StreamQuality.HIGH, StreamQuality.ULTRA],
        features: ['comments', 'chat', 'subscriptions', 'donations'],
        requirements: {
          minFollowers: 0,
          verificationRequired: false,
          ageRestriction: 13,
        },
      },
      {
        platform: StreamingPlatform.LINKEDIN,
        supported: true,
        maxDuration: 180, // 3 hours
        maxViewers: 10000,
        supportedQualities: [StreamQuality.LOW, StreamQuality.MEDIUM, StreamQuality.HIGH],
        features: ['comments', 'likes', 'sharing'],
        requirements: {
          minFollowers: 0,
          verificationRequired: false,
          ageRestriction: 18,
        },
      },
    ];
  }

  async getUserTemplates(userId: string) {
    const templates = await this.dataSource.getRepository(StreamTemplate)
      .createQueryBuilder('template')
      .where('template.userId = :userId', { userId })
      .orderBy('template.createdAt', 'DESC')
      .getMany();

    return templates;
  }

  async createTemplate(userId: string, createTemplateDto: any) {
    const template = this.dataSource.getRepository(StreamTemplate).create({
      ...createTemplateDto,
      userId,
      usageCount: 0,
    });

    return await this.dataSource.getRepository(StreamTemplate).save(template);
  }

  async updateTemplate(templateId: string, updateTemplateDto: any) {
    const template = await this.dataSource.getRepository(StreamTemplate).findOne({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    Object.assign(template, updateTemplateDto);
    return await this.dataSource.getRepository(StreamTemplate).save(template);
  }

  async deleteTemplate(templateId: string) {
    const template = await this.dataSource.getRepository(StreamTemplate).findOne({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await this.dataSource.getRepository(StreamTemplate).remove(template);
    return { success: true };
  }

  async getStreamHealth(sessionId: string) {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new NotFoundException('Stream session not found');
    }

    const healthChecks = [];
    for (const platform of session.platforms) {
      if (platform.isActive) {
        const health = await this.checkPlatformHealth(sessionId, platform.platform);
        healthChecks.push(health);
      }
    }

    return healthChecks;
  }

  async sendInvitation(userId: string, invitationDto: any) {
    const invitation = this.dataSource.getRepository(StreamInvitation).create({
      ...invitationDto,
      invitedBy: userId,
      status: 'pending',
    });

    return await this.dataSource.getRepository(StreamInvitation).save(invitation);
  }

  async respondToInvitation(invitationId: string, responseDto: any) {
    const invitation = await this.dataSource.getRepository(StreamInvitation).findOne({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    invitation.status = responseDto.status;
    return await this.dataSource.getRepository(StreamInvitation).save(invitation);
  }

  async getStreamRecordings(sessionId: string) {
    const recordings = await this.dataSource.getRepository(StreamRecording)
      .createQueryBuilder('recording')
      .where('recording.sessionId = :sessionId', { sessionId })
      .orderBy('recording.createdAt', 'DESC')
      .getMany();

    return recordings;
  }

  async generateDownloadLink(recordingId: string) {
    const recording = await this.dataSource.getRepository(StreamRecording).findOne({
      where: { id: recordingId },
    });

    if (!recording) {
      throw new NotFoundException('Recording not found');
    }

    // Generate secure download link (implementation depends on your storage solution)
    const downloadUrl = `/api/streaming/recordings/${recordingId}/download?token=${this.generateDownloadToken(recordingId)}`;
    
    return { downloadUrl, expiresAt: new Date(Date.now() + 3600000) }; // 1 hour expiry
  }

  private async initializePlatformConnection(sessionId: string, platform: StreamingPlatform, manager: any) {
    // Platform-specific initialization logic
    this.logger.log(`Initializing ${platform} connection for session ${sessionId}`);
    
    // Generate platform-specific stream key
    const streamKey = this.generatePlatformStreamKey(sessionId, platform);
    
    // Store platform connection details
    await this.redis.hset(`stream:${sessionId}:platforms`, platform, JSON.stringify({
      streamKey,
      connected: false,
      lastHeartbeat: new Date(),
    }));
  }

  private async stopPlatformConnection(sessionId: string, platform: StreamingPlatform) {
    this.logger.log(`Stopping ${platform} connection for session ${sessionId}`);
    await this.redis.hdel(`stream:${sessionId}:platforms`, platform);
  }

  private generateStreamCredentials(sessionId: string, platforms: StreamingPlatform[]) {
    const streamKey = `stream_${sessionId}_${Date.now()}`;
    const rtmpUrl = `rtmp://localhost:1935/live/${streamKey}`;

    return {
      streamKey,
      rtmpUrl,
    };
  }

  private generatePlatformStreamKey(sessionId: string, platform: StreamingPlatform): string {
    return `${platform}_${sessionId}_${Date.now()}`;
  }

  private async cacheSession(session: any) {
    await this.redis.setex(
      `stream:${session.id}`,
      3600, // 1 hour expiry
      JSON.stringify(session),
    );
  }

  private startStreamMonitoring(sessionId: string) {
    // Start real-time monitoring for the stream
    this.activeStreams.set(sessionId, {
      startTime: Date.now(),
      monitoring: true,
    });

    // Set up periodic health checks
    const interval = setInterval(async () => {
      if (!this.activeStreams.get(sessionId)?.monitoring) {
        clearInterval(interval);
        return;
      }

      await this.performHealthCheck(sessionId);
    }, 30000); // Every 30 seconds
  }

  private stopStreamMonitoring(sessionId: string) {
    const streamData = this.activeStreams.get(sessionId);
    if (streamData) {
      streamData.monitoring = false;
    }
    this.activeStreams.delete(sessionId);
  }

  private async performHealthCheck(sessionId: string) {
    // Perform health check for all active platforms
    const platforms = await this.redis.hgetall(`stream:${sessionId}:platforms`);
    
    for (const [platform, data] of Object.entries(platforms)) {
      const platformData = JSON.parse(data);
      const health = await this.checkPlatformHealth(sessionId, platform as StreamingPlatform);
      
      // Update platform health status
      await this.redis.hset(`stream:${sessionId}:platforms`, platform, JSON.stringify({
        ...platformData,
        health,
        lastHealthCheck: new Date(),
      }));
    }
  }

  private async checkPlatformHealth(sessionId: string, platform: StreamingPlatform) {
    // Mock health check - in production, this would check actual platform APIs
    return {
      sessionId,
      platform,
      status: 'healthy',
      metrics: {
        bitrate: 5000,
        fps: 30,
        droppedFrames: 0,
        latency: 100,
        bandwidth: 5.2,
      },
      timestamp: new Date(),
    };
  }

  private async pauseStream(sessionId: string) {
    await this.redis.set(`stream:${sessionId}:paused`, 'true');
  }

  private async resumeStream(sessionId: string) {
    await this.redis.del(`stream:${sessionId}:paused`);
  }

  private async switchCamera(sessionId: string, data: any) {
    await this.redis.set(`stream:${sessionId}:camera`, JSON.stringify(data));
  }

  private async toggleAudio(sessionId: string, data: any) {
    await this.redis.set(`stream:${sessionId}:audio`, JSON.stringify(data));
  }

  private async updateStreamSettings(sessionId: string, settings: any) {
    await this.redis.set(`stream:${sessionId}:settings`, JSON.stringify(settings));
  }

  private calculateMonthlyStats(sessions: any[]) {
    const monthlyStats = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      
      const monthSessions = sessions.filter(s => 
        s.createdAt.toISOString().slice(0, 7) === monthKey
      );
      
      monthlyStats.push({
        month: monthKey,
        sessions: monthSessions.length,
        views: monthSessions.reduce((sum, s) => sum + s.analytics.totalViews, 0),
        duration: monthSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      });
    }
    
    return monthlyStats;
  }

  private generateDownloadToken(recordingId: string): string {
    // Generate secure token for download
    return Buffer.from(`${recordingId}:${Date.now()}`).toString('base64');
  }
}

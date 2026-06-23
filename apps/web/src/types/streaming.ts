// Live Streaming Types

export enum StreamingPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  TWITCH = 'twitch',
  LINKEDIN = 'linkedin'
}

export enum StreamingStatus {
  IDLE = 'idle',
  PREPARING = 'preparing',
  LIVE = 'live',
  ENDED = 'ended',
  ERROR = 'error'
}

export enum StreamQuality {
  LOW = '360p',
  MEDIUM = '720p',
  HIGH = '1080p',
  ULTRA = '4K'
}

export interface StreamSession {
  id: string;
  userId: string;
  title: string;
  description?: string;
  platforms: StreamPlatform[];
  status: StreamingStatus;
  quality: StreamQuality;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  viewerCount: number;
  thumbnailUrl?: string;
  settings: StreamSettings;
  analytics: StreamAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamPlatform {
  platform: StreamingPlatform;
  isActive: boolean;
  streamKey?: string;
  streamUrl?: string;
  platformStreamId?: string;
  viewerCount: number;
  error?: string;
  lastHeartbeat?: Date;
}

export interface StreamSettings {
  camera: CameraSettings;
  audio: AudioSettings;
  video: VideoSettings;
  privacy: PrivacySettings;
  scheduling: SchedulingSettings;
}

export interface CameraSettings {
  deviceId?: string;
  resolution: string;
  frameRate: number;
  facingMode: 'user' | 'environment';
  constraints: MediaTrackConstraints;
}

export interface AudioSettings {
  deviceId?: string;
  enabled: boolean;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  volume: number;
}

export interface VideoSettings {
  quality: StreamQuality;
  bitrate: number;
  keyframeInterval: number;
  aspectRatio: string;
  filters: VideoFilter[];
}

export interface VideoFilter {
  id: string;
  name: string;
  type: 'beauty' | 'color' | 'effect' | 'text' | 'sticker';
  settings: Record<string, any>;
  intensity: number;
}

export interface PrivacySettings {
  visibility: 'public' | 'private' | 'unlisted';
  allowComments: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  ageRestriction: boolean;
  geoRestriction?: string[];
}

export interface SchedulingSettings {
  isScheduled: boolean;
  scheduledTime?: Date;
  reminderTime?: number;
  autoStart: boolean;
}

export interface StreamAnalytics {
  totalViews: number;
  peakViewers: number;
  averageViewDuration: number;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    reactions: Record<string, number>;
  };
  demographics: {
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    countries: Record<string, number>;
  };
  realTime: {
    currentViewers: number;
    bandwidth: number;
    droppedFrames: number;
    latency: number;
  };
}

export interface StreamingEvent {
  id: string;
  sessionId: string;
  type: 'viewer_join' | 'viewer_leave' | 'comment' | 'like' | 'share' | 'error';
  platform: StreamingPlatform;
  data: Record<string, any>;
  timestamp: Date;
}

export interface StreamTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  settings: StreamSettings;
  platforms: StreamingPlatform[];
  thumbnailUrl?: string;
  isDefault: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamStats {
  totalSessions: number;
  totalDuration: number;
  totalViews: number;
  averageViewers: number;
  peakViewers: number;
  engagementRate: number;
  platformBreakdown: Record<StreamingPlatform, {
    sessions: number;
    views: number;
    viewers: number;
    engagement: number;
  }>;
  monthlyStats: Array<{
    month: string;
    sessions: number;
    views: number;
    duration: number;
  }>;
}

export interface StreamingCapability {
  platform: StreamingPlatform;
  supported: boolean;
  maxDuration: number; // minutes
  maxViewers?: number;
  supportedQualities: StreamQuality[];
  features: string[];
  requirements: {
    minFollowers?: number;
    verificationRequired?: boolean;
    ageRestriction?: number;
  };
}

export interface StreamInvitation {
  id: string;
  sessionId: string;
  invitedBy: string;
  invitedUser?: string;
  platform: StreamingPlatform;
  role: 'co-host' | 'guest' | 'speaker';
  permissions: string[];
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export interface StreamRecording {
  id: string;
  sessionId: string;
  platform: StreamingPlatform;
  format: 'mp4' | 'mov' | 'avi';
  quality: StreamQuality;
  duration: number;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  isAvailable: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export interface StreamNotification {
  id: string;
  userId: string;
  sessionId: string;
  type: 'starting_soon' | 'started' | 'ended' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// API Response Types
export interface StartStreamRequest {
  title: string;
  description?: string;
  platforms: StreamingPlatform[];
  settings: Partial<StreamSettings>;
  scheduledTime?: Date;
}

export interface StartStreamResponse {
  sessionId: string;
  streamKey: string;
  rtmpUrl: string;
  platforms: StreamPlatform[];
  webSocketUrl: string;
}

export interface StreamControlRequest {
  action: 'start' | 'stop' | 'pause' | 'resume' | 'switch_camera' | 'toggle_audio' | 'update_settings';
  data?: Record<string, any>;
}

export interface StreamHealthCheck {
  sessionId: string;
  platform: StreamingPlatform;
  status: 'healthy' | 'warning' | 'error';
  metrics: {
    bitrate: number;
    fps: number;
    droppedFrames: number;
    latency: number;
    bandwidth: number;
  };
  timestamp: Date;
}

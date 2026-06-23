import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'streaming',
})
export class StreamingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(StreamingGateway.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Extract session ID from connection
    const sessionId = client.handshake.query.sessionId as string;
    if (sessionId) {
      client.join(`session:${sessionId}`);
      this.logger.log(`Client ${client.id} joined session ${sessionId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_session')
  async handleJoinSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId } = data;
    client.join(`session:${sessionId}`);
    
    // Send current stream status
    const streamData = await this.redis.get(`stream:${sessionId}`);
    if (streamData) {
      client.emit('stream_status', JSON.parse(streamData));
    }
    
    this.logger.log(`Client ${client.id} joined session ${sessionId}`);
  }

  @SubscribeMessage('leave_session')
  handleLeaveSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId } = data;
    client.leave(`session:${sessionId}`);
    this.logger.log(`Client ${client.id} left session ${sessionId}`);
  }

  @SubscribeMessage('viewer_join')
  async handleViewerJoin(
    @MessageBody() data: { sessionId: string; platform: string; viewerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, platform, viewerId } = data;
    
    // Update viewer count
    await this.redis.hincrby(`stream:${sessionId}:viewers`, platform, 1);
    
    // Broadcast viewer count update
    const viewers = await this.redis.hgetall(`stream:${sessionId}:viewers`);
    this.server.to(`session:${sessionId}`).emit('viewer_count_update', viewers);
    
    this.logger.log(`Viewer ${viewerId} joined ${platform} stream ${sessionId}`);
  }

  @SubscribeMessage('viewer_leave')
  async handleViewerLeave(
    @MessageBody() data: { sessionId: string; platform: string; viewerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, platform, viewerId } = data;
    
    // Update viewer count
    await this.redis.hincrby(`stream:${sessionId}:viewers`, platform, -1);
    
    // Broadcast viewer count update
    const viewers = await this.redis.hgetall(`stream:${sessionId}:viewers`);
    this.server.to(`session:${sessionId}`).emit('viewer_count_update', viewers);
    
    this.logger.log(`Viewer ${viewerId} left ${platform} stream ${sessionId}`);
  }

  @SubscribeMessage('stream_health')
  async handleStreamHealth(
    @MessageBody() data: { sessionId: string; platform: string; metrics: any },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, platform, metrics } = data;
    
    // Update platform health data
    await this.redis.hset(
      `stream:${sessionId}:platforms`,
      platform,
      JSON.stringify({
        ...metrics,
        lastHeartbeat: new Date(),
      }),
    );
    
    // Broadcast health update
    this.server.to(`session:${sessionId}`).emit('platform_health', {
      platform,
      metrics,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('chat_message')
  async handleChatMessage(
    @MessageBody() data: { sessionId: string; platform: string; message: any },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, platform, message } = data;
    
    // Broadcast chat message to all clients in the session
    this.server.to(`session:${sessionId}`).emit('chat_message', {
      platform,
      message,
      timestamp: new Date(),
    });
    
    // Store message for analytics
    await this.redis.lpush(
      `stream:${sessionId}:chat:${platform}`,
      JSON.stringify({ ...message, timestamp: new Date() }),
    );
    
    // Keep only last 100 messages
    await this.redis.ltrim(`stream:${sessionId}:chat:${platform}`, 0, 99);
  }

  @SubscribeMessage('engagement')
  async handleEngagement(
    @MessageBody() data: { sessionId: string; platform: string; type: string; data: any },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, platform, type, data: engagementData } = data;
    
    // Update engagement metrics
    await this.redis.hincrby(`stream:${sessionId}:engagement`, `${platform}:${type}`, 1);
    
    // Broadcast engagement update
    this.server.to(`session:${sessionId}`).emit('engagement_update', {
      platform,
      type,
      data: engagementData,
      timestamp: new Date(),
    });
    
    this.logger.log(`Engagement ${type} on ${platform} for stream ${sessionId}`);
  }

  @SubscribeMessage('stream_event')
  async handleStreamEvent(
    @MessageBody() data: { sessionId: string; event: string; data: any },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, event, data: eventData } = data;
    
    // Broadcast stream event
    this.server.to(`session:${sessionId}`).emit('stream_event', {
      event,
      data: eventData,
      timestamp: new Date(),
    });
    
    // Store event for analytics
    await this.redis.lpush(
      `stream:${sessionId}:events`,
      JSON.stringify({ event, data: eventData, timestamp: new Date() }),
    );
    
    // Keep only last 50 events
    await this.redis.ltrim(`stream:${sessionId}:events`, 0, 49);
  }

  // Server-side methods for broadcasting
  async broadcastStreamStatus(sessionId: string, status: any) {
    this.server.to(`session:${sessionId}`).emit('stream_status', status);
  }

  async broadcastViewerCount(sessionId: string, viewers: any) {
    this.server.to(`session:${sessionId}`).emit('viewer_count_update', viewers);
  }

  async broadcastPlatformStatus(sessionId: string, platform: string, status: any) {
    this.server.to(`session:${sessionId}`).emit('platform_status', {
      platform,
      status,
      timestamp: new Date(),
    });
  }

  async broadcastError(sessionId: string, error: any) {
    this.server.to(`session:${sessionId}`).emit('stream_error', {
      error,
      timestamp: new Date(),
    });
  }
}

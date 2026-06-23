import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { 
  StreamingStatus, 
  StreamingPlatform, 
  StreamQuality,
  StreamSettings,
  StreamAnalytics
} from '@socialboost/types';

@Entity('stream_sessions')
export class StreamSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: StreamingStatus,
    default: StreamingStatus.IDLE,
  })
  status: StreamingStatus;

  @Column({
    type: 'enum',
    enum: StreamQuality,
    default: StreamQuality.HIGH,
  })
  quality: StreamQuality;

  @Column({ type: 'jsonb' })
  platforms: Array<{
    platform: StreamingPlatform;
    isActive: boolean;
    streamKey?: string;
    streamUrl?: string;
    platformStreamId?: string;
    viewerCount: number;
    error?: string;
    lastHeartbeat?: Date;
  }>;

  @Column({ type: 'jsonb' })
  settings: StreamSettings;

  @Column({ type: 'jsonb' })
  analytics: StreamAnalytics;

  @Column({ nullable: true })
  viewerCount: number;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'datetime', nullable: true })
  startTime?: Date;

  @Column({ type: 'datetime', nullable: true })
  endTime?: Date;

  @Column({ nullable: true })
  duration?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

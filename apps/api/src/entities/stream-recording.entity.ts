import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { StreamingPlatform, StreamQuality } from '@socialboost/types';

@Entity('stream_recordings')
export class StreamRecording {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({
    type: 'enum',
    enum: StreamingPlatform,
  })
  platform: StreamingPlatform;

  @Column({
    type: 'enum',
    enum: ['mp4', 'mov', 'avi'],
  })
  format: 'mp4' | 'mov' | 'avi';

  @Column({
    type: 'enum',
    enum: StreamQuality,
  })
  quality: StreamQuality;

  @Column()
  duration: number;

  @Column()
  fileSize: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

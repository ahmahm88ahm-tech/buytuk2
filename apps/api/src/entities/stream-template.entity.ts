import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StreamingPlatform, StreamSettings } from '@socialboost/types';

@Entity('stream_templates')
export class StreamTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'jsonb' })
  settings: StreamSettings;

  @Column({
    type: 'enum',
    enum: StreamingPlatform,
    array: true,
  })
  platforms: StreamingPlatform[];

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: 0 })
  usageCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

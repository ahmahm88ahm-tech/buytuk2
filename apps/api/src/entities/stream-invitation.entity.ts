import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { StreamingPlatform } from '@socialboost/types';

@Entity('stream_invitations')
export class StreamInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'invited_by' })
  invitedBy: string;

  @Column({ name: 'invited_user', nullable: true })
  invitedUser?: string;

  @Column({
    type: 'enum',
    enum: StreamingPlatform,
  })
  platform: StreamingPlatform;

  @Column({
    type: 'enum',
    enum: ['co-host', 'guest', 'speaker'],
  })
  role: 'co-host' | 'guest' | 'speaker';

  @Column({ type: 'jsonb', default: '[]' })
  permissions: string[];

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'declined';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

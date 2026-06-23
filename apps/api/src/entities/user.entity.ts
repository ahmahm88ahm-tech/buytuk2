import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  gender?: 'male' | 'female' | 'other';

  @Column({ default: 'EG' })
  country: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ default: 'ar' })
  language: string;

  @Column({ default: 'Africa/Cairo' })
  timezone: string;

  @Column({ default: 'EGP' })
  currency: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken?: string;

  @Column({ nullable: true })
  emailVerificationExpires?: Date;

  @Column({ nullable: true })
  phoneVerificationToken?: string;

  @Column({ nullable: true })
  phoneVerificationExpires?: Date;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true })
  twoFactorSecret?: string;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ nullable: true })
  passwordResetExpires?: Date;

  @Column({ default: 'user' })
  role: 'user' | 'admin' | 'moderator' | 'support';

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ nullable: true })
  banReason?: string;

  @Column({ nullable: true })
  bannedAt?: Date;

  @Column({ nullable: true })
  banExpiresAt?: Date;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  facebookId?: string;

  @Column({ nullable: true })
  instagramId?: string;

  @Column({ nullable: true })
  twitterId?: string;

  @Column({ nullable: true })
  tiktokId?: string;

  @Column({ nullable: true })
  youtubeId?: string;

  @Column({ nullable: true })
  linkedinId?: string;

  @Column({ default: 'free' })
  subscriptionPlan: 'free' | 'pro' | 'elite' | 'weekly' | 'daily';

  @Column({ default: 'active' })
  subscriptionStatus: 'active' | 'cancelled' | 'expired' | 'suspended';

  @Column({ nullable: true })
  subscriptionExpiresAt?: Date;

  @Column({ nullable: true })
  subscriptionUpdatedAt?: Date;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  lastLoginIp?: string;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ nullable: true })
  lockedUntil?: Date;

  @Column({ nullable: true })
  deactivatedAt?: Date;

  @Column('jsonb', { nullable: true })
  privacy?: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
    showBirthday: boolean;
    showLocation: boolean;
  };

  @Column('jsonb', { nullable: true })
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
    security: boolean;
  };

  @Column('jsonb', { nullable: true })
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };

  @Column({ nullable: true })
  sessionId?: string;

  @Column({ nullable: true })
  sessionToken?: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  refreshExpiresAt?: Date;

  @Column({ default: 0 })
  totalPosts: number;

  @Column({ default: 0 })
  totalStreams: number;

  @Column({ default: 0 })
  totalViews: number;

  @Column({ default: 0 })
  followers: number;

  @Column({ default: 0 })
  following: number;

  @Column({ default: 0 })
  engagementRate: number;

  @Column({ nullable: true })
  profileViews: number;

  @Column({ nullable: true })
  profileViewsLastReset?: Date;

  @Column({ nullable: true })
  apiUsage?: {
    requests: number;
    lastReset: Date;
    limit: number;
  };

  @Column({ nullable: true })
  settings?: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };

  @Column({ nullable: true })
  preferences?: {
    autoSave: boolean;
    notifications: boolean;
    analytics: boolean;
    suggestions: boolean;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

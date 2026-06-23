export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  TIKTOK = 'tiktok'
}

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed'
}

export enum PaymentMethod {
  INSTAPAY = 'instapay',
  VODAFONE_CASH = 'vodafone_cash',
  STC_PAY = 'stc_pay',
  URPAY = 'urpay',
  MADA = 'mada',
  KNET = 'knet',
  APPLE_PAY = 'apple_pay',
  CREDIT_CARD = 'credit_card'
}

export enum Currency {
  EGP = 'EGP',
  SAR = 'SAR',
  KWD = 'KWD',
  USD = 'USD'
}

export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  ELITE = 'elite'
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  country: string;
  currency: Currency;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  subscription: Subscription;
  socialAccounts: SocialAccount[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialAccount {
  id: string;
  userId: string;
  platform: SocialPlatform;
  platformUserId: string;
  username: string;
  displayName: string;
  avatar?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  isActive: boolean;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  mediaUrls: string[];
  platforms: SocialPlatform[];
  hashtags: string[];
  mentions: string[];
  status: PostStatus;
  scheduledAt?: Date;
  publishedAt?: Date;
  analytics: PostAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostAnalytics {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagement: number;
  reach: number;
  impressions: number;
  platformMetrics: Record<SocialPlatform, {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  }>;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingPlan {
  tier: SubscriptionTier;
  prices: {
    egp: number;
    sar: number;
    kwd: number;
    usd: number;
  };
  features: string[];
  limits: {
    socialAccounts: number;
    scheduledPosts: number;
    aiSuggestions: number;
  };
  analytics: boolean;
  prioritySupport: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gatewayTransactionId?: string;
  qrCodeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  userId: string;
  date: Date;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  posts: number;
  platformMetrics: Record<SocialPlatform, {
    followers: number;
    engagement: number;
    reach: number;
    impressions: number;
    posts: number;
  }>;
}

export interface AIContentRequest {
  topic: string;
  platform: SocialPlatform;
  tone: 'casual' | 'professional' | 'humorous' | 'inspirational' | 'educational';
  length: 'short' | 'medium' | 'long';
  dialect: 'egyptian' | 'gulf' | 'levantine' | 'modern_standard';
  targetAudience?: string;
}

export interface AIContentResponse {
  content: string;
  hashtags: string[];
  emojis: string[];
  engagementScore: number;
  suggestions: string[];
}

export interface TrendAnalysis {
  country: string;
  platform: SocialPlatform;
  timeRange: string;
  hashtags: Array<{
    hashtag: string;
    posts: number;
    growth: number;
    category: string;
  }>;
  topics: Array<{
    topic: string;
    posts: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    growth: number;
  }>;
  peakHours: number[];
  contentTypes: Record<string, number>;
}

export interface CompetitorAnalysis {
  handle: string;
  platform: SocialPlatform;
  metrics: {
    followers: number;
    followersGrowth: number;
    engagement: number;
    postFrequency: number;
  };
  contentAnalysis: {
    topHashtags: Array<{
      hashtag: string;
      usage: number;
      engagement: number;
    }>;
    contentThemes: Array<{
      theme: string;
      percentage: number;
    }>;
    postingSchedule: Record<string, number>;
  };
  strategicInsights: string[];
  recommendations: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

export interface SystemSettings {
  key: string;
  value: string;
  description: string;
  category: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  startDate: Date;
  endDate?: Date;
  targeting: {
    countries: string[];
    tiers: SubscriptionTier[];
    platforms: SocialPlatform[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PeakHours {
  country: string;
  platform: SocialPlatform;
  hourOfDay: number;
  engagementScore: number;
  dayOfWeek: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrendingHashtag {
  country: string;
  platform: SocialPlatform;
  hashtag: string;
  postsCount: number;
  growthRate: number;
  category: string;
  sentimentScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  type: string;
  title: string;
  contentTemplate: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

// Export all streaming types
export * from './streaming';

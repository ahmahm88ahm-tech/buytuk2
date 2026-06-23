import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsEnum } from 'class-validator';
import { StreamQuality } from '@socialboost/types';

export class CreatePricingPlanDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: {
    monthly: number;
    yearly: number;
  };

  @IsString()
  currency: string;

  @IsArray()
  features: Array<{
    name: string;
    included: boolean;
  }>;

  @IsBoolean()
  highlighted: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsEnum(StreamQuality)
  maxQuality?: StreamQuality;

  @IsOptional()
  @IsNumber()
  maxSocialAccounts?: number;

  @IsOptional()
  @IsNumber()
  maxPostsPerMonth?: number;

  @IsOptional()
  @IsNumber()
  maxStreamsPerMonth?: number;

  @IsOptional()
  @IsBoolean()
  aiContentGeneration?: boolean;

  @IsOptional()
  @IsBoolean()
  liveStreaming?: boolean;

  @IsOptional()
  @IsBoolean()
  advancedAnalytics?: boolean;

  @IsOptional()
  @IsBoolean()
  prioritySupport?: boolean;

  @IsOptional()
  @IsString()
  billingCycle?: 'monthly' | 'yearly' | 'weekly' | 'daily';
}

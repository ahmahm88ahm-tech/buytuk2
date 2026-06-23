import { IsString, IsArray, IsOptional, IsEnum, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SocialPlatform } from '@socialboost/types';

export class MediaFileDto {
  @IsString()
  filename: string;

  @IsString()
  format: string;

  size: number;

  @IsOptional()
  duration?: number;
}

export class CreatePostDto {
  @IsString()
  content: string;

  @IsArray()
  @IsEnum(SocialPlatform, { each: true })
  platforms: SocialPlatform[];

  @IsArray()
  @Type(() => MediaFileDto)
  @ValidateNested({ each: true })
  images: MediaFileDto[];

  @IsArray()
  @Type(() => MediaFileDto)
  @ValidateNested({ each: true })
  videos: MediaFileDto[];

  @IsArray()
  @IsString({ each: true })
  hashtags: string[];

  @IsArray()
  @IsString({ each: true })
  mentions: string[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  settings?: {
    allowComments: boolean;
    allowSharing: boolean;
    visibility: 'public' | 'private' | 'friends';
  };
}

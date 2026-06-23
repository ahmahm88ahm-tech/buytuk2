import { IsString, IsArray, IsEnum, IsOptional, IsObject } from 'class-validator';
import { StreamingPlatform, StreamQuality } from '@socialboost/types';

export class CreateStreamDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsEnum(StreamingPlatform, { each: true })
  platforms: StreamingPlatform[];

  @IsOptional()
  @IsObject()
  settings?: {
    camera?: {
      deviceId?: string;
      resolution?: string;
      frameRate?: number;
      facingMode?: 'user' | 'environment';
      constraints?: any;
    };
    audio?: {
      deviceId?: string;
      enabled?: boolean;
      echoCancellation?: boolean;
      noiseSuppression?: boolean;
      autoGainControl?: boolean;
      volume?: number;
    };
    video?: {
      quality?: StreamQuality;
      bitrate?: number;
      keyframeInterval?: number;
      aspectRatio?: string;
      filters?: any[];
    };
    privacy?: {
      visibility?: 'public' | 'private' | 'unlisted';
      allowComments?: boolean;
      allowDuet?: boolean;
      allowStitch?: boolean;
      ageRestriction?: boolean;
      geoRestriction?: string[];
    };
    scheduling?: {
      isScheduled?: boolean;
      scheduledTime?: Date;
      reminderTime?: number;
      autoStart?: boolean;
    };
  };

  @IsOptional()
  scheduledTime?: Date;
}

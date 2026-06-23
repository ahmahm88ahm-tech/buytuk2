import { Injectable } from '@nestjs/common';

export interface PlatformLimits {
  maxCharacters: number;
  maxImages: number;
  maxVideos: number;
  supportedImageFormats: string[];
  supportedVideoFormats: string[];
  maxFileSize: number; // in MB
  maxVideoDuration: number; // in seconds
}

export interface ValidationResult {
  platform: string;
  isValid: boolean;
  warnings: string[];
  errors: string[];
  characterCount: number;
  imageCount: number;
  videoCount: number;
  characterUsage: number; // percentage
}

export interface ContentData {
  text: string;
  images: Array<{
    filename: string;
    size: number;
    format: string;
  }>;
  videos: Array<{
    filename: string;
    size: number;
    format: string;
    duration: number;
  }>;
}

@Injectable()
export class ContentValidationService {
  private readonly platformLimits: Record<string, PlatformLimits> = {
    twitter: {
      maxCharacters: 280,
      maxImages: 4,
      maxVideos: 1,
      supportedImageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      supportedVideoFormats: ['mp4', 'mov'],
      maxFileSize: 5, // 5MB for images, 15MB for videos
      maxVideoDuration: 140, // 2 minutes 20 seconds
    },
    instagram: {
      maxCharacters: 2200,
      maxImages: 10,
      maxVideos: 1,
      supportedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
      supportedVideoFormats: ['mp4', 'mov'],
      maxFileSize: 8, // 8MB for images, 100MB for videos
      maxVideoDuration: 60, // 1 minute for posts, 15 minutes for reels
    },
    facebook: {
      maxCharacters: 63206,
      maxImages: 10,
      maxVideos: 10,
      supportedImageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      supportedVideoFormats: ['mp4', 'mov', 'avi', 'mkv'],
      maxFileSize: 4, // 4GB for videos, 4MB for photos
      maxVideoDuration: 2400, // 40 minutes
    },
    tiktok: {
      maxCharacters: 150,
      maxImages: 0,
      maxVideos: 1,
      supportedImageFormats: [],
      supportedVideoFormats: ['mp4', 'mov', 'webm'],
      maxFileSize: 70, // 70MB for videos
      maxVideoDuration: 180, // 3 minutes
    },
    youtube: {
      maxCharacters: 5000,
      maxImages: 0,
      maxVideos: 1,
      supportedImageFormats: [],
      supportedVideoFormats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
      maxFileSize: 256, // 256GB for videos
      maxVideoDuration: 43200, // 12 hours
    },
    linkedin: {
      maxCharacters: 3000,
      maxImages: 100,
      maxVideos: 20,
      supportedImageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      supportedVideoFormats: ['mp4', 'mov', 'avi'],
      maxFileSize: 5, // 5GB for videos, 5MB for images
      maxVideoDuration: 600, // 10 minutes
    },
  };

  validateContent(contentData: ContentData, platforms: string[]): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const platform of platforms) {
      const limits = this.platformLimits[platform];
      if (!limits) {
        continue; // Skip unknown platforms
      }

      const result = this.validateForPlatform(contentData, platform, limits);
      results.push(result);
    }

    return results;
  }

  private validateForPlatform(contentData: ContentData, platform: string, limits: PlatformLimits): ValidationResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    let isValid = true;

    const characterCount = contentData.text.length;
    const imageCount = contentData.images.length;
    const videoCount = contentData.videos.length;
    const characterUsage = (characterCount / limits.maxCharacters) * 100;

    // Character validation
    if (characterCount > limits.maxCharacters) {
      errors.push(`Text exceeds ${limits.maxCharacters} characters limit (${characterCount} characters)`);
      isValid = false;
    } else if (characterCount > limits.maxCharacters * 0.9) {
      warnings.push(`Text is close to character limit (${Math.round(characterUsage)}% used)`);
    }

    // Image validation
    if (imageCount > limits.maxImages) {
      errors.push(`Too many images (${imageCount}/${limits.maxImages} max)`);
      isValid = false;
    }

    // Validate each image
    contentData.images.forEach((image, index) => {
      const format = image.format.toLowerCase();
      if (!limits.supportedImageFormats.includes(format)) {
        errors.push(`Unsupported image format: ${format} (image ${index + 1})`);
        isValid = false;
      }

      if (image.size > limits.maxFileSize * 1024 * 1024) {
        errors.push(`Image ${index + 1} is too large (${(image.size / 1024 / 1024).toFixed(1)}MB, max: ${limits.maxFileSize}MB)`);
        isValid = false;
      }
    });

    // Video validation
    if (videoCount > limits.maxVideos) {
      errors.push(`Too many videos (${videoCount}/${limits.maxVideos} max)`);
      isValid = false;
    }

    // Validate each video
    contentData.videos.forEach((video, index) => {
      const format = video.format.toLowerCase();
      if (!limits.supportedVideoFormats.includes(format)) {
        errors.push(`Unsupported video format: ${format} (video ${index + 1})`);
        isValid = false;
      }

      if (video.size > limits.maxFileSize * 1024 * 1024) {
        errors.push(`Video ${index + 1} is too large (${(video.size / 1024 / 1024).toFixed(1)}MB, max: ${limits.maxFileSize}MB)`);
        isValid = false;
      }

      if (video.duration > limits.maxVideoDuration) {
        errors.push(`Video ${index + 1} is too long (${video.duration}s, max: ${limits.maxVideoDuration}s)`);
        isValid = false;
      }
    });

    // Platform-specific validations
    if (platform === 'twitter') {
      if (characterCount > 280) {
        errors.push('Tweet exceeds 280 characters - will not be published to Twitter/X');
        isValid = false;
      }
    } else if (platform === 'instagram') {
      if (videoCount > 0 && imageCount > 0) {
        warnings.push('Instagram posts can have either images OR videos, not both');
      }
      if (imageCount > 0 && imageCount < 3) {
        warnings.push('Instagram carousel posts work best with 3+ images');
      }
      if (videoCount > 0 && contentData.videos[0].duration > 60) {
        warnings.push('Instagram videos longer than 60 seconds may be posted as Reels');
      }
    } else if (platform === 'tiktok') {
      if (imageCount > 0) {
        errors.push('TikTok only supports video content');
        isValid = false;
      }
      if (videoCount === 0) {
        errors.push('TikTok requires at least one video');
        isValid = false;
      }
      if (videoCount > 0 && contentData.videos[0].duration > 180) {
        errors.push('TikTok videos cannot exceed 3 minutes');
        isValid = false;
      }
    } else if (platform === 'youtube') {
      if (imageCount > 0) {
        errors.push('YouTube only supports video content');
        isValid = false;
      }
      if (videoCount === 0) {
        errors.push('YouTube requires at least one video');
        isValid = false;
      }
    } else if (platform === 'linkedin') {
      if (characterCount < 100) {
        warnings.push('LinkedIn posts with less than 100 characters may have lower engagement');
      }
      if (imageCount > 0 && imageCount < 3) {
        warnings.push('LinkedIn posts with multiple images tend to perform better');
      }
    }

    return {
      platform,
      isValid,
      warnings,
      errors,
      characterCount,
      imageCount,
      videoCount,
      characterUsage,
    };
  }

  getPlatformLimits(platform: string): PlatformLimits | null {
    return this.platformLimits[platform] || null;
  }

  getAllPlatformLimits(): Record<string, PlatformLimits> {
    return this.platformLimits;
  }

  // Helper method to check if content can be published to all selected platforms
  canPublishToAllPlatforms(contentData: ContentData, platforms: string[]): {
    canPublish: boolean;
    platformsWithErrors: string[];
    platformsWithWarnings: string[];
  } {
    const results = this.validateContent(contentData, platforms);
    const platformsWithErrors = results
      .filter(result => !result.isValid)
      .map(result => result.platform);
    const platformsWithWarnings = results
      .filter(result => result.warnings.length > 0)
      .map(result => result.platform);

    return {
      canPublish: platformsWithErrors.length === 0,
      platformsWithErrors,
      platformsWithWarnings,
    };
  }

  // Get suggested content modifications for a platform
  getSuggestions(contentData: ContentData, platform: string): string[] {
    const limits = this.platformLimits[platform];
    if (!limits) {
      return [];
    }

    const suggestions: string[] = [];
    const characterCount = contentData.text.length;
    const imageCount = contentData.images.length;
    const videoCount = contentData.videos.length;

    if (characterCount > limits.maxCharacters) {
      const excess = characterCount - limits.maxCharacters;
      suggestions.push(`Reduce text by ${excess} characters to meet the ${limits.maxCharacters} character limit`);
    }

    if (imageCount > limits.maxImages) {
      const excess = imageCount - limits.maxImages;
      suggestions.push(`Remove ${excess} image${excess > 1 ? 's' : ''} to meet the ${limits.maxImages} image limit`);
    }

    if (videoCount > limits.maxVideos) {
      const excess = videoCount - limits.maxVideos;
      suggestions.push(`Remove ${excess} video${excess > 1 ? 's' : ''} to meet the ${limits.maxVideos} video limit`);
    }

    // Platform-specific suggestions
    if (platform === 'twitter') {
      if (characterCount > 280) {
        suggestions.push('Consider splitting this into multiple tweets or using Twitter threads');
      }
    } else if (platform === 'instagram') {
      if (videoCount > 0 && imageCount > 0) {
        suggestions.push('Choose either images OR videos for Instagram, not both');
      }
      if (imageCount > 0 && imageCount < 3) {
        suggestions.push('Consider adding more images for a better carousel experience');
      }
    } else if (platform === 'tiktok') {
      if (videoCount > 0 && contentData.videos[0].duration < 15) {
        suggestions.push('TikTok videos between 15-60 seconds tend to perform better');
      }
    } else if (platform === 'linkedin') {
      if (characterCount < 100) {
        suggestions.push('Consider adding more detail to reach at least 100 characters');
      }
    }

    return suggestions;
  }

  // Get optimal content length for a platform
  getOptimalContentLength(platform: string): {
    min: number;
    max: number;
    recommended: number;
  } {
    const limits = this.platformLimits[platform];
    if (!limits) {
      return { min: 0, max: 0, recommended: 0 };
    }

    const max = limits.maxCharacters;
    let min = 10;
    let recommended = max * 0.7;

    // Platform-specific optimal ranges
    switch (platform) {
      case 'twitter':
        min = 50;
        recommended = 200;
        break;
      case 'instagram':
        min = 100;
        recommended = 1500;
        break;
      case 'facebook':
        min = 50;
        recommended = 500;
        break;
      case 'tiktok':
        min = 20;
        recommended = 100;
        break;
      case 'youtube':
        min = 100;
        recommended = 2000;
        break;
      case 'linkedin':
        min = 100;
        recommended = 1500;
        break;
    }

    return { min, max, recommended };
  }
}

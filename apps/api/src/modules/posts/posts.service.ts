import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { ContentValidationService } from '../../services/content-validation.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly contentValidationService: ContentValidationService,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto, files?: Express.Multer.File[]): Promise<Post> {
    // Validate content first
    const contentData = {
      text: createPostDto.content,
      images: createPostDto.images,
      videos: createPostDto.videos,
    };

    const validationResults = this.contentValidationService.validateContent(
      contentData,
      createPostDto.platforms,
    );

    const canPublish = this.contentValidationService.canPublishToAllPlatforms(
      contentData,
      createPostDto.platforms,
    );

    if (!canPublish.canPublish) {
      throw new HttpException(
        'Content validation failed for some platforms',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create the post
    const post = this.postRepository.create({
      id: uuidv4(),
      userId,
      content: createPostDto.content,
      platforms: createPostDto.platforms,
      images: createPostDto.images,
      videos: createPostDto.videos,
      hashtags: createPostDto.hashtags,
      mentions: createPostDto.mentions,
      scheduledAt: createPostDto.scheduledAt ? new Date(createPostDto.scheduledAt) : undefined,
      location: createPostDto.location,
      settings: createPostDto.settings,
      status: createPostDto.scheduledAt ? 'scheduled' : 'published',
      publishedAt: createPostDto.scheduledAt ? undefined : new Date(),
      validationResults,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.postRepository.save(post);
  }

  async getUserPosts(userId: string, options: {
    page?: number;
    limit?: number;
    platform?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ posts: Post[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, platform, status, startDate, endDate } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .where('post.userId = :userId', { userId })
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (platform) {
      queryBuilder.andWhere('post.platforms @> :platform', { platform: [platform] });
    }

    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }

    if (startDate) {
      queryBuilder.andWhere('post.createdAt >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      queryBuilder.andWhere('post.createdAt <= :endDate', { endDate: new Date(endDate) });
    }

    const [posts, total] = await queryBuilder.getManyAndCount();

    return {
      posts,
      total,
      page,
      limit,
    };
  }

  async getPost(userId: string, postId: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId, userId },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return post;
  }

  async updatePost(userId: string, postId: string, updatePostDto: any): Promise<Post> {
    const post = await this.getPost(userId, postId);

    // Validate updated content if provided
    if (updatePostDto.content || updatePostDto.platforms) {
      const contentData = {
        text: updatePostDto.content || post.content,
        images: updatePostDto.images || post.images,
        videos: updatePostDto.videos || post.videos,
      };

      const platforms = updatePostDto.platforms || post.platforms;
      const validationResults = this.contentValidationService.validateContent(
        contentData,
        platforms,
      );

      const canPublish = this.contentValidationService.canPublishToAllPlatforms(
        contentData,
        platforms,
      );

      if (!canPublish.canPublish) {
        throw new HttpException(
          'Content validation failed for some platforms',
          HttpStatus.BAD_REQUEST,
        );
      }

      updatePostDto.validationResults = validationResults;
    }

    await this.postRepository.update(postId, {
      ...updatePostDto,
      updatedAt: new Date(),
    });

    return this.getPost(userId, postId);
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const post = await this.getPost(userId, postId);
    await this.postRepository.delete(postId);
  }

  async publishPost(userId: string, postId: string): Promise<Post> {
    const post = await this.getPost(userId, postId);

    if (post.status === 'published') {
      throw new HttpException('Post is already published', HttpStatus.BAD_REQUEST);
    }

    await this.postRepository.update(postId, {
      status: 'published',
      publishedAt: new Date(),
      updatedAt: new Date(),
    });

    return this.getPost(userId, postId);
  }

  async schedulePost(userId: string, postId: string, scheduledAt: string): Promise<Post> {
    const post = await this.getPost(userId, postId);

    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      throw new HttpException('Scheduled time must be in the future', HttpStatus.BAD_REQUEST);
    }

    await this.postRepository.update(postId, {
      status: 'scheduled',
      scheduledAt: scheduledDate,
      updatedAt: new Date(),
    });

    return this.getPost(userId, postId);
  }

  async unpublishPost(userId: string, postId: string): Promise<Post> {
    const post = await this.getPost(userId, postId);

    if (post.status !== 'published') {
      throw new HttpException('Post is not published', HttpStatus.BAD_REQUEST);
    }

    await this.postRepository.update(postId, {
      status: 'draft',
      publishedAt: null,
      updatedAt: new Date(),
    });

    return this.getPost(userId, postId);
  }

  async getPostAnalytics(userId: string, postId: string): Promise<any> {
    const post = await this.getPost(userId, postId);

    // This would typically fetch analytics from various platforms
    // For now, return mock data
    return {
      postId: post.id,
      platforms: post.platforms.map(platform => ({
        platform,
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 200),
        engagement: Math.random() * 10,
      })),
      totalViews: Math.floor(Math.random() * 50000),
      totalLikes: Math.floor(Math.random() * 5000),
      totalShares: Math.floor(Math.random() * 2500),
      totalComments: Math.floor(Math.random() * 1000),
      averageEngagement: Math.random() * 8,
      publishedAt: post.publishedAt,
    };
  }

  async getScheduledPosts(): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .where('post.status = :status', { status: 'scheduled' })
      .andWhere('post.scheduledAt <= :now', { now: new Date() })
      .getMany();
  }

  async publishScheduledPosts(): Promise<Post[]> {
    const scheduledPosts = await this.getScheduledPosts();
    const publishedPosts: Post[] = [];

    for (const post of scheduledPosts) {
      await this.postRepository.update(post.id, {
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      });
      publishedPosts.push(post);
    }

    return publishedPosts;
  }
}

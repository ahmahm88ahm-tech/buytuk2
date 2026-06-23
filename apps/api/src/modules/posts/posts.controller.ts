import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { ContentValidationService } from '../../services/content-validation.service';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly contentValidationService: ContentValidationService,
  ) {}

  @Post('validate')
  @ApiOperation({ summary: 'Validate content for selected platforms' })
  @ApiResponse({ status: 200, description: 'Content validated successfully' })
  async validateContent(@Body() createPostDto: CreatePostDto) {
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

    return {
      validationResults,
      canPublish,
      platformsWithErrors: canPublish.platformsWithErrors,
      platformsWithWarnings: canPublish.platformsWithWarnings,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @UseInterceptors(FilesInterceptor('files'))
  async createPost(
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
  ) {
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

    // If there are errors, return them without creating the post
    if (!canPublish.canPublish) {
      return {
        success: false,
        errors: ['Content validation failed'],
        validationResults,
        platformsWithErrors: canPublish.platformsWithErrors,
        message: 'Cannot publish to all selected platforms due to validation errors',
      };
    }

    // Create the post
    const post = await this.postsService.create(req.user.id, createPostDto, files);

    return {
      success: true,
      data: post,
      validationResults,
      platformsWithWarnings: canPublish.platformsWithWarnings,
      message: 'Post created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get user posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async getPosts(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('platform') platform?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.postsService.getUserPosts(req.user.id, {
      page,
      limit,
      platform,
      status,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific post' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  async getPost(@Request() req, @Param('id') id: string) {
    return this.postsService.getPost(req.user.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  async updatePost(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePostDto: any,
  ) {
    return this.postsService.updatePost(req.user.id, id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  async deletePost(@Request() req, @Param('id') id: string) {
    return this.postsService.deletePost(req.user.id, id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a post immediately' })
  @ApiResponse({ status: 200, description: 'Post published successfully' })
  async publishPost(@Request() req, @Param('id') id: string) {
    return this.postsService.publishPost(req.user.id, id);
  }

  @Post(':id/schedule')
  @ApiOperation({ summary: 'Schedule a post for later' })
  @ApiResponse({ status: 200, description: 'Post scheduled successfully' })
  async schedulePost(
    @Request() req,
    @Param('id') id: string,
    @Body() scheduleDto: { scheduledAt: string },
  ) {
    return this.postsService.schedulePost(req.user.id, id, scheduleDto.scheduledAt);
  }

  @Post(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish a post' })
  @ApiResponse({ status: 200, description: 'Post unpublished successfully' })
  async unpublishPost(@Request() req, @Param('id') id: string) {
    return this.postsService.unpublishPost(req.user.id, id);
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get post analytics' })
  @ApiResponse({ status: 200, description: 'Post analytics retrieved successfully' })
  async getPostAnalytics(@Request() req, @Param('id') id: string) {
    return this.postsService.getPostAnalytics(req.user.id, id);
  }

  @Get('platform-limits/:platform')
  @ApiOperation({ summary: 'Get platform-specific limits' })
  @ApiResponse({ status: 200, description: 'Platform limits retrieved successfully' })
  async getPlatformLimits(@Param('platform') platform: string) {
    return this.contentValidationService.getPlatformLimits(platform);
  }

  @Get('all-platform-limits')
  @ApiOperation({ summary: 'Get all platform limits' })
  @ApiResponse({ status: 200, description: 'All platform limits retrieved successfully' })
  async getAllPlatformLimits() {
    return this.contentValidationService.getAllPlatformLimits();
  }

  @Post('suggestions')
  @ApiOperation({ summary: 'Get content suggestions for a platform' })
  @ApiResponse({ status: 200, description: 'Suggestions retrieved successfully' })
  async getSuggestions(@Body() data: { content: string; platform: string }) {
    const contentData = {
      text: data.content,
      images: [],
      videos: [],
    };

    return {
      suggestions: this.contentValidationService.getSuggestions(contentData, data.platform),
      optimalLength: this.contentValidationService.getOptimalContentLength(data.platform),
    };
  }
}

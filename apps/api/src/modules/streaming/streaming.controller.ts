import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import { StreamControlDto } from './dto/stream-control.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('streaming')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new live stream' })
  @ApiResponse({ status: 200, description: 'Stream started successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async startStream(
    @Request() req,
    @Body(ValidationPipe) createStreamDto: CreateStreamDto,
  ) {
    return this.streamingService.startStream(req.user.id, createStreamDto);
  }

  @Post(':sessionId/stop')
  @ApiOperation({ summary: 'Stop a live stream' })
  @ApiParam({ name: 'sessionId', description: 'Stream session ID' })
  @ApiResponse({ status: 200, description: 'Stream stopped successfully' })
  async stopStream(@Param('sessionId') sessionId: string) {
    return this.streamingService.stopStream(sessionId);
  }

  @Put(':sessionId/control')
  @ApiOperation({ summary: 'Control stream settings' })
  @ApiParam({ name: 'sessionId', description: 'Stream session ID' })
  @ApiResponse({ status: 200, description: 'Stream control executed successfully' })
  async controlStream(
    @Param('sessionId') sessionId: string,
    @Body(ValidationPipe) streamControlDto: StreamControlDto,
  ) {
    return this.streamingService.controlStream(sessionId, streamControlDto);
  }

  @Get('sessions/:userId')
  @ApiOperation({ summary: 'Get user streaming sessions' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  async getUserSessions(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.streamingService.getUserSessions(userId, limit, offset);
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get specific stream session details' })
  @ApiParam({ name: 'sessionId', description: 'Stream session ID' })
  @ApiResponse({ status: 200, description: 'Session details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(@Param('sessionId') sessionId: string) {
    return this.streamingService.getSession(sessionId);
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Get user streaming statistics' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getUserStats(@Param('userId') userId: string) {
    return this.streamingService.getUserStats(userId);
  }

  @Get('platforms/capabilities')
  @ApiOperation({ summary: 'Get streaming platform capabilities' })
  @ApiResponse({ status: 200, description: 'Platform capabilities retrieved successfully' })
  async getPlatformCapabilities() {
    return this.streamingService.getPlatformCapabilities();
  }

  @Get('templates/:userId')
  @ApiOperation({ summary: 'Get user stream templates' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async getUserTemplates(@Param('userId') userId: string) {
    return this.streamingService.getUserTemplates(userId);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create stream template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async createTemplate(
    @Request() req,
    @Body(ValidationPipe) createTemplateDto: any,
  ) {
    return this.streamingService.createTemplate(req.user.id, createTemplateDto);
  }

  @Put('templates/:templateId')
  @ApiOperation({ summary: 'Update stream template' })
  @ApiParam({ name: 'templateId', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  async updateTemplate(
    @Param('templateId') templateId: string,
    @Body(ValidationPipe) updateTemplateDto: any,
  ) {
    return this.streamingService.updateTemplate(templateId, updateTemplateDto);
  }

  @Delete('templates/:templateId')
  @ApiOperation({ summary: 'Delete stream template' })
  @ApiParam({ name: 'templateId', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  async deleteTemplate(@Param('templateId') templateId: string) {
    return this.streamingService.deleteTemplate(templateId);
  }

  @Get('health/:sessionId')
  @ApiOperation({ summary: 'Get stream health status' })
  @ApiParam({ name: 'sessionId', description: 'Stream session ID' })
  @ApiResponse({ status: 200, description: 'Health status retrieved successfully' })
  async getStreamHealth(@Param('sessionId') sessionId: string) {
    return this.streamingService.getStreamHealth(sessionId);
  }

  @Post('invite')
  @ApiOperation({ summary: 'Send stream invitation' })
  @ApiResponse({ status: 201, description: 'Invitation sent successfully' })
  async sendInvitation(
    @Request() req,
    @Body(ValidationPipe) invitationDto: any,
  ) {
    return this.streamingService.sendInvitation(req.user.id, invitationDto);
  }

  @Put('invite/:invitationId/respond')
  @ApiOperation({ summary: 'Respond to stream invitation' })
  @ApiParam({ name: 'invitationId', description: 'Invitation ID' })
  @ApiResponse({ status: 200, description: 'Invitation response recorded successfully' })
  async respondToInvitation(
    @Param('invitationId') invitationId: string,
    @Body(ValidationPipe) responseDto: any,
  ) {
    return this.streamingService.respondToInvitation(invitationId, responseDto);
  }

  @Get('recordings/:sessionId')
  @ApiOperation({ summary: 'Get stream recordings' })
  @ApiParam({ name: 'sessionId', description: 'Stream session ID' })
  @ApiResponse({ status: 200, description: 'Recordings retrieved successfully' })
  async getStreamRecordings(@Param('sessionId') sessionId: string) {
    return this.streamingService.getStreamRecordings(sessionId);
  }

  @Post('recordings/:recordingId/download')
  @ApiOperation({ summary: 'Generate download link for recording' })
  @ApiParam({ name: 'recordingId', description: 'Recording ID' })
  @ApiResponse({ status: 200, description: 'Download link generated successfully' })
  async generateDownloadLink(@Param('recordingId') recordingId: string) {
    return this.streamingService.generateDownloadLink(recordingId);
  }
}

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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { CreateDiscountDto } from './dto/create-discount.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Pricing Plans Management
  @Get('pricing-plans')
  @ApiOperation({ summary: 'Get all pricing plans' })
  @ApiResponse({ status: 200, description: 'Pricing plans retrieved successfully' })
  async getPricingPlans() {
    return this.adminService.getPricingPlans();
  }

  @Post('pricing-plans')
  @ApiOperation({ summary: 'Create new pricing plan' })
  @ApiResponse({ status: 201, description: 'Pricing plan created successfully' })
  async createPricingPlan(@Body() createPricingPlanDto: CreatePricingPlanDto) {
    return this.adminService.createPricingPlan(createPricingPlanDto);
  }

  @Put('pricing-plans/:id')
  @ApiOperation({ summary: 'Update pricing plan' })
  @ApiResponse({ status: 200, description: 'Pricing plan updated successfully' })
  async updatePricingPlan(
    @Param('id') id: string,
    @Body() updatePricingPlanDto: UpdatePricingPlanDto,
  ) {
    return this.adminService.updatePricingPlan(id, updatePricingPlanDto);
  }

  @Delete('pricing-plans/:id')
  @ApiOperation({ summary: 'Delete pricing plan' })
  @ApiResponse({ status: 200, description: 'Pricing plan deleted successfully' })
  async deletePricingPlan(@Param('id') id: string) {
    return this.adminService.deletePricingPlan(id);
  }

  @Put('pricing-plans/:id/toggle-active')
  @ApiOperation({ summary: 'Toggle pricing plan active status' })
  @ApiResponse({ status: 200, description: 'Pricing plan status updated' })
  async togglePricingPlanActive(@Param('id') id: string) {
    return this.adminService.togglePricingPlanActive(id);
  }

  // Discount Management
  @Post('pricing-plans/:id/discount')
  @ApiOperation({ summary: 'Create discount for pricing plan' })
  @ApiResponse({ status: 201, description: 'Discount created successfully' })
  async createDiscount(
    @Param('id') id: string,
    @Body() createDiscountDto: CreateDiscountDto,
  ) {
    return this.adminService.createDiscount(id, createDiscountDto);
  }

  @Put('pricing-plans/:id/discount')
  @ApiOperation({ summary: 'Update discount for pricing plan' })
  @ApiResponse({ status: 200, description: 'Discount updated successfully' })
  async updateDiscount(
    @Param('id') id: string,
    @Body() updateDiscountDto: CreateDiscountDto,
  ) {
    return this.adminService.updateDiscount(id, updateDiscountDto);
  }

  @Delete('pricing-plans/:id/discount')
  @ApiOperation({ summary: 'Remove discount from pricing plan' })
  @ApiResponse({ status: 200, description: 'Discount removed successfully' })
  async removeDiscount(@Param('id') id: string) {
    return this.adminService.removeDiscount(id);
  }

  // Payment Methods Management
  @Get('payment-methods')
  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully' })
  async getPaymentMethods() {
    return this.adminService.getPaymentMethods();
  }

  @Post('payment-methods')
  @ApiOperation({ summary: 'Create new payment method' })
  @ApiResponse({ status: 201, description: 'Payment method created successfully' })
  async createPaymentMethod(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.adminService.createPaymentMethod(createPaymentMethodDto);
  }

  @Put('payment-methods/:id')
  @ApiOperation({ summary: 'Update payment method' })
  @ApiResponse({ status: 200, description: 'Payment method updated successfully' })
  async updatePaymentMethod(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.adminService.updatePaymentMethod(id, updatePaymentMethodDto);
  }

  @Delete('payment-methods/:id')
  @ApiOperation({ summary: 'Delete payment method' })
  @ApiResponse({ status: 200, description: 'Payment method deleted successfully' })
  async deletePaymentMethod(@Param('id') id: string) {
    return this.adminService.deletePaymentMethod(id);
  }

  @Put('payment-methods/:id/toggle-active')
  @ApiOperation({ summary: 'Toggle payment method active status' })
  @ApiResponse({ status: 200, description: 'Payment method status updated' })
  async togglePaymentMethodActive(@Param('id') id: string) {
    return this.adminService.togglePaymentMethodActive(id);
  }

  // Admin Users Management
  @Get('users')
  @ApiOperation({ summary: 'Get all admin users' })
  @ApiResponse({ status: 200, description: 'Admin users retrieved successfully' })
  async getAdminUsers() {
    return this.adminService.getAdminUsers();
  }

  @Post('users')
  @ApiOperation({ summary: 'Create new admin user' })
  @ApiResponse({ status: 201, description: 'Admin user created successfully' })
  async createAdminUser(@Body() createAdminUserDto: CreateAdminUserDto) {
    return this.adminService.createAdminUser(createAdminUserDto);
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update admin user' })
  @ApiResponse({ status: 200, description: 'Admin user updated successfully' })
  async updateAdminUser(
    @Param('id') id: string,
    @Body() updateAdminUserDto: UpdateAdminUserDto,
  ) {
    return this.adminService.updateAdminUser(id, updateAdminUserDto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete admin user' })
  @ApiResponse({ status: 200, description: 'Admin user deleted successfully' })
  async deleteAdminUser(@Param('id') id: string) {
    return this.adminService.deleteAdminUser(id);
  }

  @Put('users/:id/toggle-active')
  @ApiOperation({ summary: 'Toggle admin user active status' })
  @ApiResponse({ status: 200, description: 'Admin user status updated' })
  async toggleAdminUserActive(@Param('id') id: string) {
    return this.adminService.toggleAdminUserActive(id);
  }

  @Put('users/:id/permissions')
  @ApiOperation({ summary: 'Update admin user permissions' })
  @ApiResponse({ status: 200, description: 'Admin user permissions updated' })
  async updateAdminUserPermissions(
    @Param('id') id: string,
    @Body() permissionsDto: { permissions: string[] },
  ) {
    return this.adminService.updateAdminUserPermissions(id, permissionsDto.permissions);
  }

  // Analytics
  @Get('analytics')
  @ApiOperation({ summary: 'Get platform analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getAnalytics(@Query('period') period?: string) {
    return this.adminService.getAnalytics(period);
  }

  @Get('analytics/revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiResponse({ status: 200, description: 'Revenue analytics retrieved successfully' })
  async getRevenueAnalytics(@Query('period') period?: string) {
    return this.adminService.getRevenueAnalytics(period);
  }

  @Get('analytics/users')
  @ApiOperation({ summary: 'Get user analytics' })
  @ApiResponse({ status: 200, description: 'User analytics retrieved successfully' })
  async getUserAnalytics(@Query('period') period?: string) {
    return this.adminService.getUserAnalytics(period);
  }

  @Get('analytics/streaming')
  @ApiOperation({ summary: 'Get streaming analytics' })
  @ApiResponse({ status: 200, description: 'Streaming analytics retrieved successfully' })
  async getStreamingAnalytics(@Query('period') period?: string) {
    return this.adminService.getStreamingAnalytics(period);
  }

  // System Settings
  @Get('settings')
  @ApiOperation({ summary: 'Get system settings' })
  @ApiResponse({ status: 200, description: 'System settings retrieved successfully' })
  async getSystemSettings() {
    return this.adminService.getSystemSettings();
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update system settings' })
  @ApiResponse({ status: 200, description: 'System settings updated successfully' })
  async updateSystemSettings(@Body() settingsDto: any) {
    return this.adminService.updateSystemSettings(settingsDto);
  }

  // User Management
  @Get('platform-users')
  @ApiOperation({ summary: 'Get all platform users' })
  @ApiResponse({ status: 200, description: 'Platform users retrieved successfully' })
  async getPlatformUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getPlatformUsers({ page, limit, search, status });
  }

  @Get('platform-users/:id')
  @ApiOperation({ summary: 'Get platform user details' })
  @ApiResponse({ status: 200, description: 'Platform user details retrieved successfully' })
  async getPlatformUser(@Param('id') id: string) {
    return this.adminService.getPlatformUser(id);
  }

  @Put('platform-users/:id/subscription')
  @ApiOperation({ summary: 'Update user subscription' })
  @ApiResponse({ status: 200, description: 'User subscription updated successfully' })
  async updateUserSubscription(
    @Param('id') id: string,
    @Body() subscriptionDto: { plan: string; status: string },
  ) {
    return this.adminService.updateUserSubscription(id, subscriptionDto);
  }

  @Put('platform-users/:id/ban')
  @ApiOperation({ summary: 'Ban platform user' })
  @ApiResponse({ status: 200, description: 'User banned successfully' })
  async banPlatformUser(
    @Param('id') id: string,
    @Body() banDto: { reason: string; duration?: number },
  ) {
    return this.adminService.banPlatformUser(id, banDto);
  }

  @Put('platform-users/:id/unban')
  @ApiOperation({ summary: 'Unban platform user' })
  @ApiResponse({ status: 200, description: 'User unbanned successfully' })
  async unbanPlatformUser(@Param('id') id: string) {
    return this.adminService.unbanPlatformUser(id);
  }

  // Content Moderation
  @Get('content/reports')
  @ApiOperation({ summary: 'Get content reports' })
  @ApiResponse({ status: 200, description: 'Content reports retrieved successfully' })
  async getContentReports(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getContentReports({ page, limit, status });
  }

  @Put('content/reports/:id/review')
  @ApiOperation({ summary: 'Review content report' })
  @ApiResponse({ status: 200, description: 'Content report reviewed successfully' })
  async reviewContentReport(
    @Param('id') id: string,
    @Body() reviewDto: { action: 'approve' | 'reject'; reason?: string },
  ) {
    return this.adminService.reviewContentReport(id, reviewDto);
  }

  // Support Tickets
  @Get('support/tickets')
  @ApiOperation({ summary: 'Get support tickets' })
  @ApiResponse({ status: 200, description: 'Support tickets retrieved successfully' })
  async getSupportTickets(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.adminService.getSupportTickets({ page, limit, status, priority });
  }

  @Put('support/tickets/:id/assign')
  @ApiOperation({ summary: 'Assign support ticket' })
  @ApiResponse({ status: 200, description: 'Support ticket assigned successfully' })
  async assignSupportTicket(
    @Param('id') id: string,
    @Body() assignDto: { adminId: string },
  ) {
    return this.adminService.assignSupportTicket(id, assignDto.adminId);
  }

  @Put('support/tickets/:id/resolve')
  @ApiOperation({ summary: 'Resolve support ticket' })
  @ApiResponse({ status: 200, description: 'Support ticket resolved successfully' })
  async resolveSupportTicket(
    @Param('id') id: string,
    @Body() resolveDto: { resolution: string },
  ) {
    return this.adminService.resolveSupportTicket(id, resolveDto);
  }

  // System Health
  @Get('health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'System health status retrieved successfully' })
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get system logs' })
  @ApiResponse({ status: 200, description: 'System logs retrieved successfully' })
  async getSystemLogs(
    @Query('level') level?: string,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getSystemLogs({ level, limit });
  }
}

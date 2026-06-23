import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  PricingPlan,
  PaymentMethod,
  AdminUser,
  PlatformUser,
  ContentReport,
  SupportTicket,
  SystemLog,
  Discount,
} from '@socialboost/types';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(PricingPlan)
    private readonly pricingPlanRepository: Repository<PricingPlan>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    @InjectRepository(PlatformUser)
    private readonly platformUserRepository: Repository<PlatformUser>,
    @InjectRepository(ContentReport)
    private readonly contentReportRepository: Repository<ContentReport>,
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepository: Repository<SupportTicket>,
    @InjectRepository(SystemLog)
    private readonly systemLogRepository: Repository<SystemLog>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  // Pricing Plans Management
  async getPricingPlans(): Promise<PricingPlan[]> {
    return this.pricingPlanRepository.find({
      order: { price: { monthly: 'ASC' } },
      relations: ['discount'],
    });
  }

  async createPricingPlan(createPricingPlanDto: any): Promise<PricingPlan> {
    const plan = this.pricingPlanRepository.create(createPricingPlanDto);
    return this.pricingPlanRepository.save(plan);
  }

  async updatePricingPlan(id: string, updatePricingPlanDto: any): Promise<PricingPlan> {
    await this.pricingPlanRepository.update(id, updatePricingPlanDto);
    return this.pricingPlanRepository.findOne({ where: { id } });
  }

  async deletePricingPlan(id: string): Promise<void> {
    const plan = await this.pricingPlanRepository.findOne({ where: { id } });
    if (!plan) {
      throw new HttpException('Pricing plan not found', HttpStatus.NOT_FOUND);
    }

    // Check if plan has active subscriptions
    const activeSubscriptions = await this.platformUserRepository.count({
      where: { 
        subscriptionPlan: plan.name,
        subscriptionStatus: 'active',
      },
    });

    if (activeSubscriptions > 0) {
      throw new HttpException(
        'Cannot delete pricing plan with active subscriptions',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.pricingPlanRepository.delete(id);
  }

  async togglePricingPlanActive(id: string): Promise<PricingPlan> {
    const plan = await this.pricingPlanRepository.findOne({ where: { id } });
    if (!plan) {
      throw new HttpException('Pricing plan not found', HttpStatus.NOT_FOUND);
    }

    plan.isActive = !plan.isActive;
    return this.pricingPlanRepository.save(plan);
  }

  // Discount Management
  async createDiscount(planId: string, createDiscountDto: any): Promise<Discount> {
    const plan = await this.pricingPlanRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw new HttpException('Pricing plan not found', HttpStatus.NOT_FOUND);
    }

    const discount = this.discountRepository.create({
      ...createDiscountDto,
      pricingPlanId: planId,
    });

    return this.discountRepository.save(discount);
  }

  async updateDiscount(planId: string, updateDiscountDto: any): Promise<Discount> {
    const existingDiscount = await this.discountRepository.findOne({
      where: { pricingPlanId: planId },
    });

    if (existingDiscount) {
      await this.discountRepository.update(existingDiscount.id, updateDiscountDto);
      return this.discountRepository.findOne({ where: { id: existingDiscount.id } });
    } else {
      return this.createDiscount(planId, updateDiscountDto);
    }
  }

  async removeDiscount(planId: string): Promise<void> {
    const discount = await this.discountRepository.findOne({
      where: { pricingPlanId: planId },
    });

    if (discount) {
      await this.discountRepository.delete(discount.id);
    }
  }

  // Payment Methods Management
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find({
      order: { name: 'ASC' },
    });
  }

  async createPaymentMethod(createPaymentMethodDto: any): Promise<PaymentMethod> {
    const method = this.paymentMethodRepository.create(createPaymentMethodDto);
    return this.paymentMethodRepository.save(method);
  }

  async updatePaymentMethod(id: string, updatePaymentMethodDto: any): Promise<PaymentMethod> {
    await this.paymentMethodRepository.update(id, updatePaymentMethodDto);
    return this.paymentMethodRepository.findOne({ where: { id } });
  }

  async deletePaymentMethod(id: string): Promise<void> {
    const method = await this.paymentMethodRepository.findOne({ where: { id } });
    if (!method) {
      throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND);
    }

    // Check if payment method has active transactions
    const activeTransactions = await this.checkActiveTransactions(id);
    if (activeTransactions > 0) {
      throw new HttpException(
        'Cannot delete payment method with active transactions',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.paymentMethodRepository.delete(id);
  }

  async togglePaymentMethodActive(id: string): Promise<PaymentMethod> {
    const method = await this.paymentMethodRepository.findOne({ where: { id } });
    if (!method) {
      throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND);
    }

    method.isActive = !method.isActive;
    return this.paymentMethodRepository.save(method);
  }

  private async checkActiveTransactions(paymentMethodId: string): Promise<number> {
    // Implementation would check for active transactions
    // This is a placeholder - in real implementation, you'd query your payment transactions table
    return 0;
  }

  // Admin Users Management
  async getAdminUsers(): Promise<AdminUser[]> {
    return this.adminUserRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async createAdminUser(createAdminUserDto: any): Promise<AdminUser> {
    const existingUser = await this.adminUserRepository.findOne({
      where: [
        { email: createAdminUserDto.email },
        { username: createAdminUserDto.username },
      ],
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(createAdminUserDto.password, 10);
    const user = this.adminUserRepository.create({
      ...createAdminUserDto,
      password: hashedPassword,
    });

    return this.adminUserRepository.save(user);
  }

  async updateAdminUser(id: string, updateAdminUserDto: any): Promise<AdminUser> {
    if (updateAdminUserDto.password) {
      updateAdminUserDto.password = await bcrypt.hash(updateAdminUserDto.password, 10);
    }

    await this.adminUserRepository.update(id, updateAdminUserDto);
    return this.adminUserRepository.findOne({ where: { id } });
  }

  async deleteAdminUser(id: string): Promise<void> {
    const user = await this.adminUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Admin user not found', HttpStatus.NOT_FOUND);
    }

    // Don't allow deletion of the last admin
    const adminCount = await this.adminUserRepository.count({
      where: { role: 'admin', isActive: true },
    });

    if (adminCount <= 1 && user.role === 'admin') {
      throw new HttpException(
        'Cannot delete the last admin user',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.adminUserRepository.delete(id);
  }

  async toggleAdminUserActive(id: string): Promise<AdminUser> {
    const user = await this.adminUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Admin user not found', HttpStatus.NOT_FOUND);
    }

    user.isActive = !user.isActive;
    return this.adminUserRepository.save(user);
  }

  async updateAdminUserPermissions(id: string, permissions: string[]): Promise<AdminUser> {
    const user = await this.adminUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Admin user not found', HttpStatus.NOT_FOUND);
    }

    user.permissions = permissions;
    return this.adminUserRepository.save(user);
  }

  // Analytics
  async getAnalytics(period: string = '30d'): Promise<any> {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const [
      totalUsers,
      activeUsers,
      totalRevenue,
      activeStreams,
      totalPosts,
      platformStats,
    ] = await Promise.all([
      this.platformUserRepository.count(),
      this.platformUserRepository.count({
        where: {
          lastLoginAt: MoreThan(startDate),
          isActive: true,
        },
      }),
      this.getTotalRevenue(startDate, now),
      this.getActiveStreams(startDate, now),
      this.getTotalPosts(startDate, now),
      this.getPlatformStats(startDate, now),
    ]);

    return {
      period,
      totalUsers,
      activeUsers,
      totalRevenue,
      activeStreams,
      totalPosts,
      platformStats,
    };
  }

  async getRevenueAnalytics(period: string = '30d'): Promise<any> {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 30);

    const revenueByPlan = await this.getRevenueByPlan(startDate, now);
    const revenueByPaymentMethod = await this.getRevenueByPaymentMethod(startDate, now);
    const revenueByCountry = await this.getRevenueByCountry(startDate, now);

    return {
      revenueByPlan,
      revenueByPaymentMethod,
      revenueByCountry,
    };
  }

  async getUserAnalytics(period: string = '30d'): Promise<any> {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 30);

    const [
      userGrowth,
      userRetention,
      userByCountry,
      userBySubscription,
    ] = await Promise.all([
      this.getUserGrowth(startDate, now),
      this.getUserRetention(startDate, now),
      this.getUserByCountry(),
      this.getUserBySubscription(),
    ]);

    return {
      userGrowth,
      userRetention,
      userByCountry,
      userBySubscription,
    };
  }

  async getStreamingAnalytics(period: string = '30d'): Promise<any> {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 30);

    const [
      streamingStats,
      platformPerformance,
      qualityMetrics,
    ] = await Promise.all([
      this.getStreamingStats(startDate, now),
      this.getPlatformPerformance(startDate, now),
      this.getQualityMetrics(startDate, now),
    ]);

    return {
      streamingStats,
      platformPerformance,
      qualityMetrics,
    };
  }

  // System Settings
  async getSystemSettings(): Promise<any> {
    // Implementation would fetch system settings from database or config
    return {
      maintenanceMode: false,
      registrationEnabled: true,
      streamingEnabled: true,
      aiEnabled: true,
      maxConcurrentStreams: 1000,
      defaultCurrency: 'EGP',
      supportedCountries: ['EG', 'SA', 'KW', 'AE'],
    };
  }

  async updateSystemSettings(settingsDto: any): Promise<any> {
    // Implementation would update system settings in database or config
    return this.getSystemSettings();
  }

  // Platform Users Management
  async getPlatformUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<any> {
    const { page = 1, limit = 20, search, status } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.platformUserRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.subscription', 'subscription')
      .skip(skip)
      .take(limit);

    if (search) {
      queryBuilder.where(
        'user.username ILIKE :search OR user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('user.isActive = :status', { status: status === 'active' });
    }

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPlatformUser(id: string): Promise<PlatformUser> {
    const user = await this.platformUserRepository.findOne({
      where: { id },
      relations: ['subscription', 'socialAccounts'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateUserSubscription(id: string, subscriptionDto: any): Promise<PlatformUser> {
    const user = await this.platformUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.subscriptionPlan = subscriptionDto.plan;
    user.subscriptionStatus = subscriptionDto.status;
    user.subscriptionUpdatedAt = new Date();

    return this.platformUserRepository.save(user);
  }

  async banPlatformUser(id: string, banDto: any): Promise<PlatformUser> {
    const user = await this.platformUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.isBanned = true;
    user.banReason = banDto.reason;
    user.bannedAt = new Date();
    if (banDto.duration) {
      user.banExpiresAt = new Date(Date.now() + banDto.duration * 24 * 60 * 60 * 1000);
    }

    return this.platformUserRepository.save(user);
  }

  async unbanPlatformUser(id: string): Promise<PlatformUser> {
    const user = await this.platformUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.isBanned = false;
    user.banReason = null;
    user.bannedAt = null;
    user.banExpiresAt = null;

    return this.platformUserRepository.save(user);
  }

  // Content Moderation
  async getContentReports(options: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<any> {
    const { page = 1, limit = 20, status } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.contentReportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.reporter', 'reporter')
      .leftJoinAndSelect('report.reportedUser', 'reportedUser')
      .skip(skip)
      .take(limit)
      .orderBy('report.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('report.status = :status', { status });
    }

    const [reports, total] = await queryBuilder.getManyAndCount();

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async reviewContentReport(id: string, reviewDto: any): Promise<ContentReport> {
    const report = await this.contentReportRepository.findOne({ where: { id } });
    if (!report) {
      throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
    }

    report.status = reviewDto.action === 'approve' ? 'approved' : 'rejected';
    report.reviewedAt = new Date();
    report.reviewReason = reviewDto.reason;

    return this.contentReportRepository.save(report);
  }

  // Support Tickets
  async getSupportTickets(options: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }): Promise<any> {
    const { page = 1, limit = 20, status, priority } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.supportTicketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.user', 'user')
      .leftJoinAndSelect('ticket.assignedAdmin', 'assignedAdmin')
      .skip(skip)
      .take(limit)
      .orderBy('ticket.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('ticket.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('ticket.priority = :priority', { priority });
    }

    const [tickets, total] = await queryBuilder.getManyAndCount();

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async assignSupportTicket(id: string, adminId: string): Promise<SupportTicket> {
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    }

    const admin = await this.adminUserRepository.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }

    ticket.assignedAdminId = adminId;
    ticket.status = 'assigned';
    ticket.assignedAt = new Date();

    return this.supportTicketRepository.save(ticket);
  }

  async resolveSupportTicket(id: string, resolveDto: any): Promise<SupportTicket> {
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    }

    ticket.status = 'resolved';
    ticket.resolution = resolveDto.resolution;
    ticket.resolvedAt = new Date();

    return this.supportTicketRepository.save(ticket);
  }

  // System Health
  async getSystemHealth(): Promise<any> {
    const [
      databaseHealth,
      redisHealth,
      diskUsage,
      memoryUsage,
      activeConnections,
    ] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkRedisHealth(),
      this.getDiskUsage(),
      this.getMemoryUsage(),
      this.getActiveConnections(),
    ]);

    return {
      database: databaseHealth,
      redis: redisHealth,
      disk: diskUsage,
      memory: memoryUsage,
      connections: activeConnections,
      timestamp: new Date(),
    };
  }

  async getSystemLogs(options: {
    level?: string;
    limit?: number;
  }): Promise<SystemLog[]> {
    const { level, limit = 100 } = options;

    const queryBuilder = this.systemLogRepository
      .createQueryBuilder('log')
      .orderBy('log.createdAt', 'DESC')
      .take(limit);

    if (level) {
      queryBuilder.andWhere('log.level = :level', { level });
    }

    return queryBuilder.getMany();
  }

  // Helper methods for analytics
  private async getTotalRevenue(startDate: Date, endDate: Date): Promise<number> {
    // Implementation would calculate total revenue from payments
    return 45678; // Placeholder
  }

  private async getActiveStreams(startDate: Date, endDate: Date): Promise<number> {
    // Implementation would count active streaming sessions
    return 156; // Placeholder
  }

  private async getTotalPosts(startDate: Date, endDate: Date): Promise<number> {
    // Implementation would count total posts
    return 1234; // Placeholder
  }

  private async getPlatformStats(startDate: Date, endDate: Date): Promise<any> {
    // Implementation would get platform-specific statistics
    return {
      facebook: { users: 5000, posts: 234, streams: 45 },
      instagram: { users: 3000, posts: 456, streams: 23 },
      youtube: { users: 2000, posts: 123, streams: 67 },
      tiktok: { users: 1500, posts: 789, streams: 21 },
    };
  }

  private async getRevenueByPlan(startDate: Date, endDate: Date): Promise<any> {
    // Implementation would calculate revenue by pricing plan
    return [
      { plan: 'Free', revenue: 0 },
      { plan: 'Pro', revenue: 25000 },
      { plan: 'Elite', revenue: 20000 },
      { plan: 'Weekly', revenue: 5000 },
      { plan: 'Daily', revenue: 2000 },
    ];
  }

  private async getRevenueByPaymentMethod(startDate: Date, endDate: Date): Promise<any> {
    // Implementation would calculate revenue by payment method
    return [
      { method: 'Credit Card', revenue: 30000 },
      { method: 'InstaPay', revenue: 15000 },
      { method: 'Vodafone Cash', revenue: 8000 },
      { method: 'STC Pay', revenue: 5000 },
      { method: 'K-Net', revenue: 2000 },
    ];
  }

  private async getRevenueByCountry(startDate: Date, endDate: Date): Promise<any> {
    // Implementation would calculate revenue by country
    return [
      { country: 'EG', revenue: 40000 },
      { country: 'SA', revenue: 15000 },
      { country: 'KW', revenue: 8000 },
      { country: 'AE', revenue: 5000 },
    ];
  }

  private async getUserGrowth(startDate: Date, endDate: Date): Promise<any> {
    // Implementation would calculate user growth over time
    return {
      newUsers: 1234,
      growthRate: 15.5,
      retentionRate: 85.2,
    };
  }

  private async getUserRetention(startDate: Date, endDate: Date): Promise<any> {
    // Implementation would calculate user retention metrics
    return {
      day1: 95.2,
      day7: 85.2,
      day30: 75.8,
      day90: 65.4,
    };
  }

  private async getUserByCountry(): Promise<any> {
    // Implementation would get user distribution by country
    return [
      { country: 'EG', users: 8000 },
      { country: 'SA', users: 3000 },
      { country: 'KW', users: 1500 },
      { country: 'AE', users: 1000 },
    ];
  }

  private async getUserBySubscription(): Promise<any> {
    // Implementation would get user distribution by subscription plan
    return [
      { plan: 'Free', users: 10000 },
      { plan: 'Pro', users: 3000 },
      { plan: 'Elite', users: 500 },
      { plan: 'Weekly', users: 200 },
      { plan: 'Daily', users: 100 },
    ];
  }

  private async getStreamingStats(startDate: Date, endDate: Date): Promise<any> {
    // Implementation would get streaming statistics
    return {
      totalStreams: 1234,
      totalDuration: 1234567, // seconds
      averageViewers: 150,
      peakViewers: 5000,
    };
  }

  private async getPlatformPerformance(startDate: Date, endDate: Date): Promise<any> {
    // Implementation would get platform-specific streaming performance
    return [
      { platform: 'facebook', streams: 456, viewers: 15000 },
      { platform: 'youtube', streams: 345, viewers: 12000 },
      { platform: 'instagram', streams: 234, viewers: 8000 },
      { platform: 'tiktok', streams: 123, viewers: 5000 },
    ];
  }

  private async getQualityMetrics(startDate: Date, endDate: Date): Promise<any> {
    // Implementation would get streaming quality metrics
    return {
      averageBitrate: 2500, // kbps
      averageFPS: 30,
      droppedFrames: 2.5, // percentage
      uptime: 99.5, // percentage
    };
  }

  private async checkDatabaseHealth(): Promise<any> {
    // Implementation would check database connectivity and performance
    return {
      status: 'healthy',
      responseTime: 15, // ms
      connections: 25,
    };
  }

  private async checkRedisHealth(): Promise<any> {
    // Implementation would check Redis connectivity and performance
    return {
      status: 'healthy',
      responseTime: 5, // ms
      memory: '45MB',
    };
  }

  private async getDiskUsage(): Promise<any> {
    // Implementation would get disk usage statistics
    return {
      total: '500GB',
      used: '250GB',
      available: '250GB',
      percentage: 50,
    };
  }

  private async getMemoryUsage(): Promise<any> {
    // Implementation would get memory usage statistics
    return {
      total: '16GB',
      used: '8GB',
      available: '8GB',
      percentage: 50,
    };
  }

  private async getActiveConnections(): Promise<number> {
    // Implementation would count active database connections
    return 25;
  }

  // Cron jobs for automated tasks
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredDiscounts(): Promise<void> {
    const expiredDiscounts = await this.discountRepository.find({
      where: {
        validUntil: MoreThan(new Date()),
      },
    });

    for (const discount of expiredDiscounts) {
      await this.discountRepository.delete(discount.id);
    }

    console.log(`Cleaned up ${expiredDiscounts.length} expired discounts`);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateSystemMetrics(): Promise<void> {
    // Update system metrics for monitoring
    const health = await this.getSystemHealth();
    
    // Store metrics in database or send to monitoring service
    console.log('System metrics updated:', health);
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async generateReports(): Promise<void> {
    // Generate daily/weekly reports
    const analytics = await this.getAnalytics('24h');
    const revenue = await this.getRevenueAnalytics('24h');
    
    // Store reports or send to admin dashboard
    console.log('Reports generated:', { analytics, revenue });
  }
}

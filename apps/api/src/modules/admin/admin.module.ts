import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin.guard';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PricingPlan,
      PaymentMethod,
      AdminUser,
      PlatformUser,
      ContentReport,
      SupportTicket,
      SystemLog,
      Discount,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
  exports: [AdminService],
})
export class AdminModule {}

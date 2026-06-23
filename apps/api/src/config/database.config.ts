import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { SocialAccount } from '../modules/social-accounts/entities/social-account.entity';
import { Post } from '../modules/posts/entities/post.entity';
import { Payment } from '../modules/payments/entities/payment.entity';
import { Subscription } from '../modules/payments/entities/subscription.entity';
import { Analytics } from '../modules/analytics/entities/analytics.entity';
import { CompetitorAnalysis } from '../modules/analytics/entities/competitor-analysis.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';
import { Advertisement } from '../modules/admin/entities/advertisement.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'socialboost',
  entities: [
    User,
    SocialAccount,
    Post,
    Payment,
    Subscription,
    Analytics,
    CompetitorAnalysis,
    Notification,
    Advertisement,
  ],
  migrations: ['dist/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

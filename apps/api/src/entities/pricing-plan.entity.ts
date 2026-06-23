import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Discount } from './discount.entity';

@Entity('pricing_plans')
export class PricingPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('jsonb')
  price: {
    monthly: number;
    yearly: number;
    weekly?: number;
    daily?: number;
  };

  @Column({ default: 'EGP' })
  currency: string;

  @Column('jsonb')
  features: Array<{
    name: string;
    included: boolean;
  }>;

  @Column({ default: false })
  highlighted: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  maxQuality?: string;

  @Column({ nullable: true })
  maxSocialAccounts?: number;

  @Column({ nullable: true })
  maxPostsPerMonth?: number;

  @Column({ nullable: true })
  maxStreamsPerMonth?: number;

  @Column({ nullable: true })
  aiContentGeneration?: boolean;

  @Column({ nullable: true })
  liveStreaming?: boolean;

  @Column({ nullable: true })
  advancedAnalytics?: boolean;

  @Column({ nullable: true })
  prioritySupport?: boolean;

  @Column({ nullable: true })
  billingCycle?: 'monthly' | 'yearly' | 'weekly' | 'daily';

  @Column({ nullable: true })
  trialDays?: number;

  @Column({ nullable: true })
  setupFee?: number;

  @OneToMany(() => Discount, (discount) => discount.pricingPlan)
  discounts: Discount[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

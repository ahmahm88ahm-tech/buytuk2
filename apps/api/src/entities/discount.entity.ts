import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PricingPlan } from './pricing-plan.entity';

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pricingPlanId: string;

  @Column()
  type: 'percentage' | 'fixed';

  @Column()
  value: number;

  @Column()
  validUntil: Date;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ nullable: true })
  minAmount?: number;

  @Column({ nullable: true })
  maxDiscountAmount?: number;

  @Column({ nullable: true })
  usageLimit?: number;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => PricingPlan, (plan) => plan.discounts)
  pricingPlan: PricingPlan;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

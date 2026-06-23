import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: 'card' | 'instapay' | 'vodafone_cash' | 'stc_pay' | 'knet' | 'paypal' | 'apple_pay' | 'google_pay';

  @Column('jsonb')
  currency: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb')
  fees: {
    percentage: number;
    fixed: number;
  };

  @Column('jsonb', { nullable: true })
  config?: Record<string, any>;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  requiresVerification?: boolean;

  @Column({ nullable: true })
  minAmount?: number;

  @Column({ nullable: true })
  maxAmount?: number;

  @Column('jsonb', { nullable: true })
  supportedCountries?: string[];

  @Column({ nullable: true })
  webhookSecret?: string;

  @Column({ nullable: true })
  merchantId?: string;

  @Column({ nullable: true })
  apiKey?: string;

  @Column({ nullable: true })
  apiSecret?: string;

  @Column({ nullable: true })
  environment?: 'sandbox' | 'production';

  @Column({ default: 0 })
  transactionCount: number;

  @Column({ default: 0 })
  totalVolume: number;

  @Column({ nullable: true })
  lastTransactionAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

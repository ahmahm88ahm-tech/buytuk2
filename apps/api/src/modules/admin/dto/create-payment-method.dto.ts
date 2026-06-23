import { IsString, IsArray, IsBoolean, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  name: string;

  @IsEnum(['card', 'instapay', 'vodafone_cash', 'stc_pay', 'knet', 'paypal', 'apple_pay', 'google_pay'])
  type: string;

  @IsArray()
  currency: string[];

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  fees: {
    percentage: number;
    fixed: number;
  };

  @IsOptional()
  config?: Record<string, any>;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsBoolean()
  requiresVerification?: boolean;

  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @IsOptional()
  @IsArray()
  supportedCountries?: string[];
}

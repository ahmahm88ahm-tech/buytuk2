import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateDiscountDto {
  @IsEnum(['percentage', 'fixed'])
  type: 'percentage' | 'fixed';

  @IsNumber()
  value: number;

  @IsDateString()
  validUntil: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  maxDiscountAmount?: number;

  @IsOptional()
  @IsNumber()
  usageLimit?: number;

  @IsOptional()
  @IsNumber()
  usageCount?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

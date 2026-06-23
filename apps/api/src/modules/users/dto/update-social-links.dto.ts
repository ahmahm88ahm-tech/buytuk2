import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateSocialLinksDto {
  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  facebook?: string;

  @IsOptional()
  @IsUrl()
  instagram?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  youtube?: string;

  @IsOptional()
  @IsUrl()
  tiktok?: string;
}

import { IsBoolean, IsOptional, IsEnum } from 'class-validator';

export class UpdatePrivacyDto {
  @IsOptional()
  @IsEnum(['public', 'private', 'friends'])
  profileVisibility?: 'public' | 'private' | 'friends';

  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  showPhone?: boolean;

  @IsOptional()
  @IsBoolean()
  showBirthday?: boolean;

  @IsOptional()
  @IsBoolean()
  showLocation?: boolean;
}

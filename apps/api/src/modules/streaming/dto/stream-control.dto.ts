import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export class StreamControlDto {
  @IsEnum(['start', 'stop', 'pause', 'resume', 'switch_camera', 'toggle_audio', 'update_settings'])
  action: string;

  @IsOptional()
  @IsObject()
  data?: any;
}

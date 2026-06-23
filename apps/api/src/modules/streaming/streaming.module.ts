import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamingController } from './streaming.controller';
import { StreamingService } from './streaming.service';
import { 
  StreamSession, 
  StreamTemplate, 
  StreamInvitation, 
  StreamRecording 
} from '@socialboost/types';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StreamSession,
      StreamTemplate,
      StreamInvitation,
      StreamRecording,
    ]),
    RedisModule,
  ],
  controllers: [StreamingController],
  providers: [StreamingService],
  exports: [StreamingService],
})
export class StreamingModule {}

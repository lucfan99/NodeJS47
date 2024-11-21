import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { SharedModule } from 'src/shared/shared.module';
import { EmailModule } from 'src/email/email.module';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  controllers: [VideoController],
  providers: [VideoService, JwtStrategy], // strategy de verify token
  imports: [SharedModule, EmailModule], // import sharedModule để sử dụng CloudinaryService
})
export class VideoModule {}

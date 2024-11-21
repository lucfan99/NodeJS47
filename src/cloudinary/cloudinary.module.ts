import { Module } from '@nestjs/common';
import { cloudinaryConfig } from './cloudinary.config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [cloudinaryConfig, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}

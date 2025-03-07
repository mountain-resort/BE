import { Module } from '@nestjs/common';
import { MulterModule as NestMulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { MulterService } from './multer.service';
import { MulterController } from './multer.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MulterConfigProvider } from './multer.config';

@Module({
  imports: [
    ConfigModule,
    CloudinaryModule,
    NestMulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: MulterConfigProvider.useFactory,
      inject: MulterConfigProvider.inject,
    }),
  ],
  providers: [MulterService],
  controllers: [MulterController],
  exports: [NestMulterModule, MulterService],
})
export class MulterModule {}

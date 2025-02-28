import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { PrismaService } from './prisma-client';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from './multer/multer.module';

@Module({
  imports: [CloudinaryModule, MulterModule],
  controllers: [CommonController],
  providers: [CommonService, PrismaService],
  exports: [PrismaService, CloudinaryModule, MulterModule],
})
export class CommonModule {}

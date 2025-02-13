import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { PrismaService } from './prismaClient';

@Module({
  controllers: [CommonController],
  providers: [CommonService, PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}

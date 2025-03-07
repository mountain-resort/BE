import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { PrismaService } from 'src/common/prisma-client';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository, PrismaService],
  exports: [ReviewsService],
})
export class ReviewsModule {}

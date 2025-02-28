import { Module } from '@nestjs/common';
import { DiningService } from './dining.service';
import { DiningController } from './dining.controller';
import { CommonModule } from 'src/common/common.module';
import { DiningRepository } from './dining.repository';

@Module({
  imports: [CommonModule],
  controllers: [DiningController],
  providers: [DiningService, DiningRepository],
  exports: [DiningService],
})
export class DiningModule {}

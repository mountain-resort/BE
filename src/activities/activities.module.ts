import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivityRepository } from './activities.repository';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivityRepository],
})
export class ActivitiesModule {}

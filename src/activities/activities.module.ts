import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { CommonModule } from 'src/common/common.module';
import { ActivityRepository } from './activities.repository';
@Module({
  imports: [CommonModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivityRepository],
})
export class ActivitiesModule {}

import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityRepository } from './activities.repository';
import { QueryStringDto } from './dto/query-string.dto';
@Injectable()
export class ActivitiesService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async getActivityList(params: QueryStringDto) {
    const [list, totalCount] = await Promise.all([
      this.activityRepository.getActivityList(params),
      this.activityRepository.getTotalCount(params),
    ]);

    const hasNext = totalCount > params.page * params.pageSize;
    const totalPage = Math.ceil(totalCount / params.pageSize);
    const currentPage = params.page;

    return {
      hasNext,
      totalPage,
      currentPage,
      list,
    };
  }

  getActivityById(id: number) {
    return this.activityRepository.getActivityById(id);
  }

  createActivity(createActivityDto: CreateActivityDto) {
    return 'This action adds a new activity';
  }
  updateActivity(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  deleteActivityById(id: number) {
    return `This action removes a #${id} activity`;
  }
}

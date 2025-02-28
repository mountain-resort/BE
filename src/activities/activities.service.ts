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

  async getActivityById(id: number) {
    return await this.activityRepository.getActivityById(id);
  }

  async createActivity(
    createActivityData: CreateActivityDto & { imageUrl: string },
  ) {
    return await this.activityRepository.createActivity(createActivityData);
  }

  async updateActivity(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  async deleteActivityById(id: number) {
    return await this.activityRepository.deleteActivityById(id);
  }
}

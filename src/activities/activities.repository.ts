import { PrismaService } from 'src/common/prisma-client';
import { QueryStringDto } from './dto/query-string.dto';
import { OffsetQueryBuilder } from 'src/common/builders/query-builder';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityRepository {
  private readonly SEARCH_FIELDS = ['name', 'description'];

  constructor(private readonly prismaClient: PrismaService) {}

  async getTotalCount(params: QueryStringDto) {
    const query = new OffsetQueryBuilder()
      .withSearch(this.SEARCH_FIELDS, params.keyword)
      .withOrder(params.sortBy, params.orderBy)
      .build();

    return await this.prismaClient.activity.count({ ...query });
  }

  async getActivityList(params: QueryStringDto) {
    const query = new OffsetQueryBuilder()
      .withSearch(this.SEARCH_FIELDS, params.keyword)
      .withOrder(params.sortBy, params.orderBy)
      .build();
    return await this.prismaClient.activity.findMany({
      ...query,
      select: {
        id: true,
        name: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        category: true,
        categoryId: true,
      },
    });
  }

  async getActivityById(id: number) {
    return await this.prismaClient.activity.findUniqueOrThrow({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        category: true,
        categoryId: true,
      },
    });
  }

  async createActivity(createActivityDto: CreateActivityDto) {
    return await this.prismaClient.activity.create({ data: createActivityDto });
  }
  async updateActivity() {
    return `This action updates a # activity`;
  }

  async deleteActivityById(id: number) {
    const activity = await this.prismaClient.activity.findUniqueOrThrow({
      where: { id },
    });

    if (activity.isDeleted) {
      throw new BadRequestException(`Activity #${id} is already deleted.`);
    }

    return await this.prismaClient.activity.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

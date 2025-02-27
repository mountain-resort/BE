import { PrismaService } from 'src/common/prisma-client';
import { QueryStringDto } from './dto/query-string.dto';
import { OffsetQueryBuilder } from 'src/common/builders/query-builder';
import { Injectable } from '@nestjs/common';

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

  createActivity() {
    return 'This action adds a new activity';
  }
  updateActivity() {
    return `This action updates a # activity`;
  }

  deleteActivityById(id: number) {
    return `This action removes a #${id} activity`;
  }
}

import { PrismaService } from 'src/common/prisma-client';
import { QueryStringDto } from './dto/query-string.dto';
import { OffsetQueryBuilder } from 'src/common/builders/query-builder';
import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class ActivityRepository {
  private readonly SEARCH_FIELDS = ['name', 'description'];

  constructor(private readonly prismaClient: PrismaService) {}

  async getTotalCount(params: QueryStringDto) {
    const query = new OffsetQueryBuilder()
      .withSearch(this.SEARCH_FIELDS, params.keyword)
      .build();

    return await this.prismaClient.activity.count(query.where);
  }

  async getActivityList(params: QueryStringDto) {
    let query: {
      where?: Prisma.ActivityWhereInput;
      skip?: number;
      take?: number;
      orderBy?: Prisma.ActivityOrderByWithRelationInput[];
    };

    if (params.sortBy === 'category') {
      query = new OffsetQueryBuilder()
        .withSearch(this.SEARCH_FIELDS, params.keyword)
        .withOffset(params.page, params.pageSize)
        .build();
      query.orderBy = [{ category: { name: params.orderBy } }, { id: 'asc' }];
    } else {
      query = new OffsetQueryBuilder()
        .withSearch(this.SEARCH_FIELDS, params.keyword)
        .withOrder(params.sortBy, params.orderBy)
        .withOffset(params.page, params.pageSize)
        .build();
    }

    return await this.prismaClient.activity.findMany({
      ...query,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true } },
      },
    });
  }

  async getActivityById(id: number) {
    return await this.prismaClient.activity.findUniqueOrThrow({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        description: true,
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

  async updateActivity(id: number, updateActivity: UpdateActivityDto) {
    return await this.prismaClient.activity.update({
      where: { id, isDeleted: false },
      data: updateActivity,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        category: true,
        categoryId: true,
      },
    });
  }

  async deleteActivityById(id: number) {
    return await this.prismaClient.activity.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

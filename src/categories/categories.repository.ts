import { Injectable } from '@nestjs/common';
import { Prisma, Category } from '@prisma/client';
import { PrismaService } from 'src/common/prisma-client';
import { QueryStringDto } from './dto/query-string.dto';
import { CursorQueryBuilder } from 'src/common/builders/query-builder';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}
  private readonly SEARCH_FIELDS = ['name', 'description'];

  async getTotalCount(params: QueryStringDto) {
    const query = new CursorQueryBuilder()
      .withSearch(this.SEARCH_FIELDS, params.keyword)
      .withOrder('id', 'desc')
      .build();

    return await this.prisma.category.count({
      where: { ...query.where, isDeleted: false },
    });
  }

  async getCategoryList(params: QueryStringDto): Promise<Partial<Category>[]> {
    const query = new CursorQueryBuilder()
      .withSearch(this.SEARCH_FIELDS, params.keyword)
      .withOrder(params.sortBy, params.orderBy)
      .withCursor(params.cursor, params.limit)
      .build();

    return await this.prisma.category.findMany({
      ...query,
      select: {
        id: true,
        name: true,
        description: true,
        overview: true,
        imageUrl: true,
        heroImageUrl: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, firstName: true } },
        activities: true,
      },
    });
  }

  async getCategoryById(id: number) {
    return await this.prisma.category.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        overview: true,
        imageUrl: true,
        heroImageUrl: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, firstName: true } },
        activities: true,
      },
    });
  }

  async createCategory(
    data: Prisma.CategoryCreateInput,
  ): Promise<Partial<Category>> {
    return await this.prisma.category.create({
      data,
      select: {
        id: true,
        name: true,
        description: true,
        overview: true,
        imageUrl: true,
        heroImageUrl: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, firstName: true } },
        activities: true,
      },
    });
  }

  async updateCategory(
    id: number,
    categoryData: Prisma.CategoryUpdateInput,
  ): Promise<Partial<Category>> {
    return await this.prisma.category.update({
      where: { id, isDeleted: false },
      data: categoryData,
      select: {
        id: true,
        name: true,
        description: true,
        overview: true,
        imageUrl: true,
        heroImageUrl: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, firstName: true } },
        activities: true,
      },
    });
  }

  async deleteCategoryById(id: number) {
    return await this.prisma.category.update({
      where: { id, isDeleted: false },
      data: { isDeleted: true },
    });
  }

  async restoreCategoryById(id: number) {
    return await this.prisma.category.update({
      where: { id, isDeleted: true },
      data: { isDeleted: false },
    });
  }
}

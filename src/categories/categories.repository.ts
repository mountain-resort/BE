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
      .build();
    return await this.prisma.category.count({ where: query.where });
  }

  async getCategoryList(params: QueryStringDto) {
    const query = new CursorQueryBuilder()
      .withSearch(this.SEARCH_FIELDS, params.keyword)
      .withCursor(params.cursor, params.limit);
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
      },
    });
  }

  async getCategoryById(id: number) {
    return await this.prisma.category.findUniqueOrThrow({
      where: { id },
    });
  }

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return await this.prisma.category.create({
      data,
    });
  }

  async updateCategory(id: number, categoryData: Prisma.CategoryUpdateInput) {
    return await this.prisma.category.update({
      where: { id, isDeleted: false },
      data: categoryData,
    });
  }

  async deleteCategoryById(id: number) {
    return await this.prisma.category.update({
      where: { id, isDeleted: false },
      data: { isDeleted: true },
    });
  }
}

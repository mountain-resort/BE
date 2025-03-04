import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './categories.repository';
import { QueryStringDto } from './dto/query-string.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategoryList(params: QueryStringDto) {
    const limit = params.limit || 10;
    const [list, totalCount] = await Promise.all([
      this.categoryRepository.getCategoryList(params),
      this.categoryRepository.getTotalCount(params),
    ]);

    console.log(list);

    const hasNext = list.length === limit;
    const nextCursor = hasNext ? list[list.length - 1]?.id : null;

    return {
      hasNext,
      nextCursor,
      totalCount,
      list,
    };
  }

  async getCategoryById(id: number) {
    return await this.categoryRepository.getCategoryById(id);
  }

  async createCategory(createCategoryDto: CreateCategoryDto, adminId: number) {
    const { activityIds, ...categoryData } = createCategoryDto;
    const prismaInput: Prisma.CategoryCreateInput = {
      ...categoryData,
      createdBy: {
        connect: { id: adminId },
      },
      activities: {
        connect: activityIds.map((id: number) => ({ id })),
      },
    };

    return await this.categoryRepository.createCategory(prismaInput);
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    adminId: number,
  ) {
    const { activityIds, ...categoryData } = updateCategoryDto;

    const prismaInput: Prisma.CategoryUpdateInput = {
      ...categoryData,
      createdBy: {
        connect: { id: adminId },
      },

      activities: activityIds
        ? {
            set: activityIds.map((id: number) => ({ id })),
          }
        : undefined,
    };
    return await this.categoryRepository.updateCategory(id, prismaInput);
  }

  async deleteCategoryById(id: number) {
    return await this.categoryRepository.deleteCategoryById(id);
  }

  async restoreCategoryById(id: number) {
    return await this.categoryRepository.restoreCategoryById(id);
  }
}

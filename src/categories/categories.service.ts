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
    const [list, totalCount] = await Promise.all([
      this.categoryRepository.getCategoryList(params),
      this.categoryRepository.getTotalCount(params),
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

  async getCategoryById(id: number) {
    return await this.categoryRepository.getCategoryById(id);
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { activityIds, adminId, ...categoryData } = createCategoryDto;
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

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { activityIds, adminId, ...categoryData } = updateCategoryDto;

    const prismaInput: Prisma.CategoryUpdateInput = {
      ...categoryData,
      createdBy: {
        connect: { id: adminId },
      },
      activities: {
        connect: activityIds.map((id: number) => ({ id })),
      },
    };
    return await this.categoryRepository.updateCategory(id, prismaInput);
  }

  async deleteCategoryById(id: number) {
    return await this.categoryRepository.deleteCategoryById(id);
  }
}

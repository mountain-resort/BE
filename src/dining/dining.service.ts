import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiningDto } from './dto/create-dining.dto';
import { UpdateDiningDto } from './dto/update-dining.dto';
import { DiningRepository } from './dining.repository';
import { DiningType } from '@prisma/client';
import { WhereCondition } from './dto/where-condition.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiningService {
  constructor(private readonly diningRepository: DiningRepository) {}

  async createDining(createDiningDto: CreateDiningDto) {
    const dining = await this.diningRepository.createDining(createDiningDto);
    return dining;
  }

  async getDiningList(page: number, pageSize: number, keyword: string, isDeleted: string | null, type: DiningType | null, sortBy: string, orderBy: string) {
    const where = this.getWhereCondition(keyword, isDeleted, type);
    const orderByCondition = this.getOrderByCondition(sortBy, orderBy);
    const [diningList, totalCount] = await Promise.all([
      this.diningRepository.getDiningList(where, orderByCondition),
      this.diningRepository.getCountDiningList(where),
    ]);

    const hasNext = totalCount > page * pageSize;
    const totalPage = Math.ceil(totalCount / pageSize);
    
    return {
      hasNext,
      totalPage,
      currentPage : page,
      list: diningList,
    };
  }

  async getDiningById(id: number) {
    const dining = await this.diningRepository.getDiningById(id);
    if(!dining) {
      throw new NotFoundException('Not Found Dining');
    }
    return dining;
  }

  async updateDining(id: number, updateDiningDto: UpdateDiningDto) {
    const dining = await this.diningRepository.updateDining(id, updateDiningDto);
    return dining;
  }

  async deleteDining(id: number) {
    const dining = await this.diningRepository.deleteDining(id);
    return dining;
  }

  private getWhereCondition(keyword: string, isDeleted: string | null, type: DiningType | null) {
    const where: WhereCondition = {};
    const OR = [
      { name: { contains: keyword } },
      { description: { contains: keyword } },
    ];

    if (type) {
      where.type = type;
    }

    if (isDeleted !== null && isDeleted !== 'null') {
      where.isDeleted = isDeleted === 'true' ? true : false;  
    } 

    where.OR = OR;

    return where;
  }

  private getOrderByCondition(sortBy: string, orderBy: string) {
    const orderByCondition: Prisma.DiningOrderByWithRelationInput[] = [];

    if (sortBy) {
      orderByCondition.push({ [sortBy]: orderBy as Prisma.SortOrder });
    }

    return orderByCondition;
  }
}

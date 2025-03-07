import { Injectable } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  async getFaqList(
    page: number,
    pageSize: number,
    keyword: string,
    sortBy: string,
    orderBy: string,
  ) {
    const whereCondition = this.getWhereCondition(keyword);
    const orderByCondition = this.getOrderByCondition(sortBy, orderBy);

    const [faqList, totalFaqCount] = await Promise.all([
      this.faqRepository.getFaqList(
        page,
        pageSize,
        whereCondition,
        orderByCondition,
      ),
      this.faqRepository.getTotalFaqCount(keyword),
    ]);

    const hasNext = totalFaqCount > page * pageSize;
    const totalPages = Math.ceil(totalFaqCount / pageSize);

    return {
      hasNext,
      totalPages,
      currentPage: page,
      list: faqList,
    };
  }

  getFaqById(id: number) {
    return this.faqRepository.getFaqById(id);
  }

  createFaq(adminId: number, createFaqDto: CreateFaqDto) {
    return this.faqRepository.createFaq(adminId, createFaqDto);
  }

  updateFaq(id: number, updateFaqDto: UpdateFaqDto) {
    return this.faqRepository.updateFaq(id, updateFaqDto);
  }

  deleteFaq(id: number) {
    return this.faqRepository.deleteFaq(id);
  }

  private getWhereCondition(keyword: string) {
    const whereCondition: Prisma.FaqWhereInput = {};
    if (keyword) {
      whereCondition.OR = [
        { question: { contains: keyword } },
        { answer: { contains: keyword } },
      ];
    }
    return whereCondition;
  }

  private getOrderByCondition(sortBy: string, orderBy: string) {
    const orderByCondition: Prisma.FaqOrderByWithRelationInput = {
      [sortBy]: orderBy,
    };
    return orderByCondition;
  }
}

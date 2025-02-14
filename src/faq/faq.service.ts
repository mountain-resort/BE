import { Injectable } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { CreateFaqDto } from './dto/create.faq.dto';
import { UpdateFaqDto } from './dto/update.faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  getList(keyword: string, sortBy: string, orderBy: string) {
    const queryString = this.setQueryString(sortBy, orderBy);
    return this.faqRepository.getList(keyword, queryString.orderBy);
  }

  getById(id: number) {
    return this.faqRepository.getById(id);
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

  private setQueryString(sortBy: string, orderBy: string) {
    switch (sortBy) {
      case 'author':
        return {
          orderBy: {
            admin: {
              firstName: orderBy,
            },
          },
        };
      default:
        return {
          orderBy: {
            createdAt: orderBy,
          },
        };
    }
  }
}

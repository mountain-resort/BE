import { Injectable } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { OrderByDto } from 'src/common/dto/order-by.dto';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  getFaqList(keyword: string, sortBy: string, orderBy: string) {
    const orderByCondition = this.getOrderByCondition(sortBy, orderBy);
    return this.faqRepository.getFaqList(keyword, orderByCondition);
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

  private getOrderByCondition(sortBy: string, orderBy: string) {
    const orderByCondition: OrderByDto = {
      [sortBy]: orderBy,
    };
    return orderByCondition;
  }
}

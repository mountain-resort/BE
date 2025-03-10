import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Req,
  UsePipes,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { QueryStringDto } from './dto/query-string.dto';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { CreateFaqValidationPipe } from './pipes/create-faq.validation.pipe';
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  async getFaqList(@Query() query: QueryStringDto) {
    const { keyword = '', sortBy = 'createdAt', orderBy = 'desc' } = query;
    const faqList = await this.faqService.getFaqList(keyword, sortBy, orderBy);
    return faqList;
  }

  @Get(':id')
  async getFaqById(@Param('id') faqId: number) {
    const faq = await this.faqService.getFaqById(faqId);
    return faq;
  }

  @Post()
  @UsePipes(CreateFaqValidationPipe)
  async createFaq(@Body() createFaqDto: CreateFaqDto) {
    const adminId = 1; // 권한 작업후 수정 필요
    const faq = await this.faqService.createFaq(adminId, createFaqDto);
    return faq;
  }

  @Patch(':id')
  async updateFaq(
    @Param('id') faqId: number,
    @Body() updateFaqDto: UpdateFaqDto,
  ) {
    const faq = await this.faqService.updateFaq(faqId, updateFaqDto);
    return faq;
  }

  @Delete(':id')
  async deleteFaq(@Param('id') faqId: number) {
    const faq = await this.faqService.deleteFaq(faqId);
    return faq;
  }
}

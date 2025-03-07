import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { CommonModule } from 'src/common/common.module';
import { FaqRepository } from './faq.repository';
@Module({
  imports: [CommonModule],
  controllers: [FaqController],
  providers: [FaqService, FaqRepository],
  exports: [FaqService],
})
export class FaqModule {}

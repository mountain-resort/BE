import { PipeTransform, BadRequestException } from '@nestjs/common';

export class UpdateReviewTitlePipe implements PipeTransform {
  transform(value: any) {
    return this.updateReviewTitle(value);
  }

  private updateReviewTitle(value: any) {
    const { title } = value;
    if (!title) {
      throw new BadRequestException('title is required');
    }
    return title;
  }
}

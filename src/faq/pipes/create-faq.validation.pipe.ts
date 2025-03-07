import { BadRequestException, PipeTransform } from '@nestjs/common';

export class CreateFaqValidationPipe implements PipeTransform {
  transform(value: any) {
    this.validate(value);
    return value;
  }

  private validate(value: any) {
    if (!value.question || !value.answer) {
      throw new BadRequestException('질문과 답변은 필수 입력 항목입니다.');
    }
  }
}

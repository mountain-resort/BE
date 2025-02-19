import { PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateMemberDto } from '../dto/create-member.dto';

export class CreateMemberPipe implements PipeTransform {
  transform(value: any) {
    return this.createMember(value);
  }

  private async createMember(value: CreateMemberDto) {
    const { firstName, lastName, email, password } = value;

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email');
    }

    if (!passwordRegex.test(password)) {
      throw new BadRequestException(
        'password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
      );
    }

    return value;
  }
}

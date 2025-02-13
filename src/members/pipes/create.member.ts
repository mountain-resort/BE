import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMemberDto } from '../dto/create.member';
import { MembersService } from '../members.service';
export class CreateMemberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    this.createMember(value);
    return value;
  }

  private async createMember(value: CreateMemberDto) {
    const { firstName, lastName, email, password } = value;

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName || !lastName || !email || !password) {
      throw new BadRequestException('Missing required fields');
    }

    if (!passwordRegex.test(password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
      );
    }

    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email');
    }

    return value;
  }
}

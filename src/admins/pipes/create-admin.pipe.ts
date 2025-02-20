import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { AdminsService } from '../admins.service';
@Injectable()
export class CreateAdminPipe implements PipeTransform {
  constructor(private readonly adminsService: AdminsService) {}
  async transform(value: CreateAdminDto) {
    await this.validateAdmin(value);
    return value;
  }

  private async validateAdmin(data: CreateAdminDto) {
    const { email, password, mobile } = data;
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [findAdminByEmail, findAdminByMobile] = await Promise.all([
      this.adminsService.getAdminByEmail(email),
      this.adminsService.getAdminByMobile(mobile),
    ]);
    if (findAdminByEmail) {
      throw new BadRequestException('Email already exists');
    }
    if (findAdminByMobile) {
      throw new BadRequestException('Mobile already exists');
    }

    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email');
    }

    if (!passwordRegex.test(password)) {
      throw new BadRequestException(
        'password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
      );
    }
  }
}

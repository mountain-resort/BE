import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { AdminsRepository } from './admins.repository';
import { WhereCondition } from './dto/whereCondition.dto';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  async getAdminList(
    page: number,
    pageSize: number,
    keyword: string,
    isDeleted: string | null,
  ) {
    const where: WhereCondition = this.getWhereCondition(keyword, isDeleted);
    const [adminList, totalCount] = await Promise.all([
      this.adminsRepository.getAdminList(where, page, pageSize),
      this.adminsRepository.getCountAdminList(where),
    ]);

    const hasNext = totalCount > page * pageSize;
    const totalPage = Math.ceil(totalCount / pageSize);
    const currentPage = page;

    return {
      hasNext,
      totalPage,
      currentPage,
      list: adminList,
    };
  }

  async getAdminById(id: number) {
    const admin = await this.adminsRepository.getAdminById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const { encryptedPassword, refreshToken, ...rest } = admin;
    return rest;
  }

  async checkPassword(adminId: number, password: string) {
    const admin = await this.adminsRepository.getAdminById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      admin.encryptedPassword,
    );

    return isPasswordCorrect;
  }

  async checkRefreshToken(adminId: number, refreshToken: string) {
    const admin = await this.adminsRepository.getAdminById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin.refreshToken === refreshToken;
  }

  async createAdmin(admin: CreateAdminDto) {
    const checkEmail = await this.adminsRepository.getAdminByEmail(admin.email);
    if (checkEmail) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const { password, ...rest } = admin;
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const newAdmin = await this.adminsRepository.createAdmin({
      ...rest,
      encryptedPassword: hashedPassword,
    });

    return newAdmin;
  }

  async signIn(email: string, password: string) {
    const admin = await this.adminsRepository.getAdminByEmail(email);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (admin.isDeleted) {
      throw new UnprocessableEntityException('Admin is deleted');
    }

    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      admin.encryptedPassword,
    );

    if (!isPasswordCorrect) {
      throw new UnprocessableEntityException('Invalid password');
    }

    const { encryptedPassword, refreshToken, ...rest } = admin;
    return rest;
  }

  async updateAdmin(adminId: number, admin: UpdateAdminDto) {
    try {
      const { password, ...rest } = admin;
      const hashedPassword: string = await bcrypt.hash(password, 10);
      const updatedAdmin = await this.adminsRepository.updateAdmin(adminId, {
        ...rest,
        encryptedPassword: hashedPassword,
      });
      return updatedAdmin;
    } catch (error) {
      throw new BadRequestException('Failed to update admin');
    }
  }

  async updateAdminRefreshToken(adminId: number, refreshToken: string) {
    const updatedAdmin = await this.adminsRepository.updateAdmin(adminId, {
      refreshToken,
    });
    return updatedAdmin;
  }

  async deleteAdmin(adminId: number) {
    return this.adminsRepository.deleteAdmin(adminId);
  }

  private getWhereCondition(keyword: string, isDeleted: string | null) {
    const OR = [
      { firstName: { contains: keyword } },
      { lastName: { contains: keyword } },
    ];

    if (isDeleted === null || isDeleted === 'null') {
      return {
        OR,
      };
    } else {
      return {
        isDeleted: isDeleted === 'true' ? true : false,
        OR,
      };
    }
  }
}

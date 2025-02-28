import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { AdminsRepository } from './admins.repository';
import { WhereCondition } from './dto/where-condition.dto';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { OrderByDto } from 'src/common/dto/order-by.dto';
import { Authority } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminsService {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  async getAdminList(
    page: number,
    pageSize: number,
    keyword: string,
    isDeleted: string | null,
    auth: string | null,
    sortBy: string,
    orderBy: string,
  ) {
    const where: WhereCondition = this.getWhereCondition(
      keyword,
      isDeleted,
      auth,
    );
    const orderByCondition = this.getOrderByCondition(sortBy, orderBy);
    const [adminList, totalCount] = await Promise.all([
      this.adminsRepository.getAdminList(
        where,
        orderByCondition,
        page,
        pageSize,
      ),
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

  async getAdminByEmail(email: string) {
    return this.adminsRepository.getAdminByEmail(email);
  }

  async getAdminByMobile(mobile: string) {
    return this.adminsRepository.getAdminByMobile(mobile);
  }

  async getAdminById(id: number) {
    const admin = await this.adminsRepository.getAdminById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const { encryptedPassword, refreshToken, isDeleted, ...rest } = admin;
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
      const { encryptedPassword, isDeleted, ...response } = updatedAdmin;
      return response;
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

  private getWhereCondition(
    keyword: string,
    isDeleted: string | null,
    authority: string | null,
  ) {
    const where: WhereCondition = {};
    const OR = [
      { firstName: { contains: keyword } },
      { lastName: { contains: keyword } },
    ];

    if (isDeleted === null || isDeleted === 'null') {
      where.OR = OR;
    } else {
      where.isDeleted = isDeleted === 'true' ? true : false;
      where.OR = OR;
    }

    if (authority) {
      where.authority = authority as Authority;
    }

    return where;
  }

  private getOrderByCondition(sortBy: string, orderBy: string) {
    const orderByCondition: Prisma.AdminOrderByWithRelationInput = {};

    switch (sortBy) {
      case 'auth':
        orderByCondition.authority = orderBy as Prisma.SortOrder;
        break;
      default:
        orderByCondition.createdAt = orderBy as Prisma.SortOrder;
    }
    return orderByCondition;
  }
}

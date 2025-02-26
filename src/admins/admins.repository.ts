import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma-client';
import { WhereCondition } from './dto/where-condition.dto';
import { Prisma } from '@prisma/client';
import { OrderByDto } from 'src/common/dto/order-by.dto';
@Injectable()
export class AdminsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getCountAdminList(where: WhereCondition) {
    return this.prisma.admin.count({
      where,
    });
  }

  getAdminList(
    where: WhereCondition,
    orderBy: OrderByDto,
    page: number,
    pageSize: number,
  ) {
    return this.prisma.admin.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isDeleted: true,
        authority: true,
        mobile: true,
      },
    });
  }

  getAdminById(id: number) {
    return this.prisma.admin.findFirst({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        encryptedPassword: true,
        email: true,
        isDeleted: true,
        authority: true,
        refreshToken: true,
        mobile: true,
      },
    });
  }

  getAdminByEmail(email: string) {
    return this.prisma.admin.findFirst({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        encryptedPassword: true,
        email: true,
        isDeleted: true,
        authority: true,
        refreshToken: true,
        mobile: true,
      },
    });
  }

  getAdminByMobile(mobile: string) {
    return this.prisma.admin.findFirst({
      where: { mobile },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        encryptedPassword: true,
        email: true,
        isDeleted: true,
        authority: true,
        refreshToken: true,
        mobile: true,
      },
    });
  }

  createAdmin(data: Prisma.AdminCreateInput) {
    return this.prisma.admin.create({
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isDeleted: true,
        authority: true,
        mobile: true,
        encryptedPassword: true,
      },
    });
  }

  updateAdmin(id: number, data: Prisma.AdminUpdateInput) {
    return this.prisma.admin.update({
      where: { id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isDeleted: true,
        authority: true,
        mobile: true,
        encryptedPassword: true,
      },
    });
  }

  deleteAdmin(id: number) {
    return this.prisma.admin.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

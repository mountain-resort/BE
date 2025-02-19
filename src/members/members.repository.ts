import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma-client';
import { WhereCondition } from './dto/whereCondition.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class MembersRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  getCountMemberList(where: WhereCondition) {
    return this.prismaClient.member.count({ where });
  }

  getMemberList(where: WhereCondition, page: number, pageSize: number) {
    return this.prismaClient.member.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        mileage: true,
      },
    });
  }

  getMemberById(id: number) {
    return this.prismaClient.member.findFirst({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        mileage: true,
        encryptedPassword: true,
        refreshToken: true,
      },
    });
  }

  getMemberByEmail(email: string) {
    return this.prismaClient.member.findFirst({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        mileage: true,
        encryptedPassword: true,
        refreshToken: true,
        isDeleted: true,
      },
    });
  }

  createMember(data: Prisma.MemberCreateInput) {
    return this.prismaClient.member.create({
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        mileage: true,
      },
    });
  }

  updateMember(id: number, data: Prisma.MemberUpdateInput) {
    return this.prismaClient.member.update({
      where: { id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        mileage: true,
      },
    });
  }

  deleteMember(id: number) {
    return this.prismaClient.member.update({
      where: { id },
      data: { isDeleted: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }
}

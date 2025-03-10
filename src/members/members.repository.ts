import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma-client';
import { WhereCondition } from './dto/where-condition.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class MembersRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  getCountMemberList(where: WhereCondition) {
    return this.prismaClient.member.count({ where });
  }

  getMemberList(
    where: WhereCondition,
    orderBy: Prisma.MemberOrderByWithRelationInput,
    page: number,
    pageSize: number,
  ) {
    return this.prismaClient.member.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        loyaltyPoints: true,
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
        loyaltyPoints: true,
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
        loyaltyPoints: true,
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
        loyaltyPoints: true,
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
        loyaltyPoints: true,
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

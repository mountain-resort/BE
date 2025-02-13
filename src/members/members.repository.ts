import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prismaClient';
import { WhereCondition } from './dto/whereCondition';
import { CreateMemberDto } from './dto/create.member';
import { UpdateMemberDto } from './dto/update.member';
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
      },
    });
  }

  createMember(member: CreateMemberDto) {
    return this.prismaClient.member.create({
      data: member,
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

  updateMember(id: number, member: UpdateMemberDto) {
    return this.prismaClient.member.update({
      where: { id },
      data: member,
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

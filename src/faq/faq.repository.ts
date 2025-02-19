import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma-client';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { OrderByQueryDto } from '../common/dto/order-by.dto';
@Injectable()
export class FaqRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  getList(keyword: string, orderBy: OrderByQueryDto['orderBy']) {
    return this.prismaClient.faq.findMany({
      where: {
        OR: [
          { question: { contains: keyword } },
          { answer: { contains: keyword } },
        ],
      },
      orderBy,
      select: {
        id: true,
        question: true,
        answer: true,
        isDeleted: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  getById(id: number) {
    return this.prismaClient.faq.findUnique({
      where: { id },
      select: {
        id: true,
        question: true,
        answer: true,
        isDeleted: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  createFaq(adminId: number, data: CreateFaqDto) {
    return this.prismaClient.faq.create({
      data: {
        ...data,
        createdBy: {
          connect: { id: adminId },
        },
      },
    });
  }

  updateFaq(id: number, data: UpdateFaqDto) {
    return this.prismaClient.faq.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  deleteFaq(id: number) {
    return this.prismaClient.faq.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

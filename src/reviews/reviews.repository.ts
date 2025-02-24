import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma-client';
import { Prisma } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getReviewCount(whereCondition: Prisma.ReviewWhereInput) {
    return this.prisma.review.count({
      where: whereCondition,
    });
  }

  getReviewList(
    whereCondition: Prisma.ReviewWhereInput,
    orderCondition: Prisma.ReviewOrderByWithRelationInput,
    page: number,
    pageSize: number,
  ) {
    return this.prisma.review.findMany({
      where: whereCondition,
      orderBy: orderCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        rating: true,
        comment: true,
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  getReviewById(id: number) {
    return this.prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        rating: true,
        comment: true,
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  createReview(
    memberId: number,
    accommodationId: number,
    review: CreateReviewDto,
  ) {
    return this.prisma.review.create({
      data: {
        memberId,
        accommodationId,
        ...review,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  updateReview(id: number, review: Prisma.ReviewUpdateInput) {
    return this.prisma.review.update({
      where: { id },
      data: review,
      select: {
        id: true,
        rating: true,
        comment: true,
        title: true,
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  updateReviewBest(id: number) {
    return this.prisma.review.update({
      where: { id },
      data: { isBest: true },
      select: {
        id: true,
        rating: true,
        comment: true,
        title: true,
        isBest: true,
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  updateReviewNotBest(id: number) {
    return this.prisma.review.update({
      where: { id },
      data: { isBest: false },
      select: {
        id: true,
        rating: true,
        comment: true,
        title: true,
        isBest: true,
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  deleteReview(id: number) {
    return this.prisma.review.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { Prisma } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async getReviewList(
    page: number,
    pageSize: number,
    roomType: number,
    keyword: string,
    isBest: string | null,
    orderBy: string,
    sortBy: string,
  ) {
    const whereCondition = this.getWhereCondition(roomType, keyword, isBest);
    const orderCondition = this.getOrderCondition(orderBy, sortBy);
    const [reviewList, reviewCount] = await Promise.all([
      this.reviewsRepository.getReviewList(
        whereCondition,
        orderCondition,
        page,
        pageSize,
      ),
      this.reviewsRepository.getTotalReviewCount(whereCondition),
    ]);

    const hasNext = reviewCount > page * pageSize;
    const totalPage = Math.ceil(reviewCount / pageSize);
    const currentPage = page;

    return {
      hasNext,
      totalPage,
      currentPage,
      list: reviewList,
    };
  }

  async getReviewById(id: number) {
    const review = await this.reviewsRepository.getReviewById(id);
    if (!review) {
      throw new NotFoundException('Not Found Review');
    }
    return review;
  }

  async createReview(
    memberId: number,
    propertyId: number,
    review: CreateReviewDto,
  ) {
    return this.reviewsRepository.createReview(memberId, propertyId, review);
  }

  async updateReview(id: number, review: UpdateReviewDto) {
    return this.reviewsRepository.updateReview(id, review);
  }

  async deleteReview(id: number) {
    return this.reviewsRepository.deleteReview(id);
  }

  async updateReviewBest(id: number) {
    const review = await this.reviewsRepository.getReviewById(id);
    if (!review) {
      throw new NotFoundException('Not Found Review');
    }
    if (review.isBest) {
      throw new BadRequestException('this review is already best');
    }
    return this.reviewsRepository.updateReviewBest(id);
  }

  async updateReviewNotBest(id: number) {
    const review = await this.reviewsRepository.getReviewById(id);
    if (!review) {
      throw new NotFoundException('Not Found Review');
    }
    if (!review.isBest) {
      throw new BadRequestException('this review is not best');
    }
    return this.reviewsRepository.updateReviewNotBest(id);
  }

  private getWhereCondition(
    roomType: number,
    keyword: string,
    isBest: string | null,
  ) {
    const whereCondition: Prisma.ReviewWhereInput = {};
    if (roomType) {
      whereCondition.propertyId = roomType;
    }

    if (keyword) {
      whereCondition.OR = [{ comment: { contains: keyword } }];
    }

    if (isBest !== null && isBest !== 'null') {
      // 쿼리 파람이 없다면 조건 추가 안함
      whereCondition.isBest = isBest === 'true' ? true : false;
    }

    return whereCondition;
  }

  private getOrderCondition(orderBy: string, sortBy: string) {
    const orderCondition: Prisma.ReviewOrderByWithRelationInput = {
      [sortBy]: orderBy,
    };
    return orderCondition;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) {
    const whereCondition = this.setWhereCondition(roomType, keyword, isBest);
    const [reviewList, reviewCount] = await Promise.all([
      this.reviewsRepository.getReviewList(whereCondition, page, pageSize),
      this.reviewsRepository.getReviewCount(whereCondition),
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

  async createReview(memberId: number, review: CreateReviewDto) {
    return this.reviewsRepository.createReview(memberId, review);
  }

  async updateReview(id: number, review: UpdateReviewDto) {
    return this.reviewsRepository.updateReview(id, review);
  }

  async deleteReview(id: number) {
    return this.reviewsRepository.deleteReview(id);
  }

  async updateReviewNotBest(id: number) {
    return this.reviewsRepository.updateReviewNotBest(id);
  }

  async updateReviewBest(id: number) {
    return this.reviewsRepository.updateReviewBest(id);
  }

  private setWhereCondition(
    roomType: number,
    keyword: string,
    isBest: string | null,
  ) {
    const whereCondition: Prisma.ReviewWhereInput = {};
    if (roomType) {
      whereCondition.accommodationId = roomType;
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
}

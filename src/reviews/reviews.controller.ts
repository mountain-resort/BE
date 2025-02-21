import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  UseGuards,
  Patch,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayloadDto } from 'src/common/dto/token-payload.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id')
  async getReviewById(@Param('id') id: number) {
    const review = await this.reviewsService.getReviewById(id);
    return review;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createReview(
    @Body() data: CreateReviewDto,
    @User() user: TokenPayloadDto,
  ) {
    const memberId = user.id;
    const review = await this.reviewsService.createReview(memberId, data);
    return review;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateReview(
    @Param('id') reviewId: number,
    @Body() data: UpdateReviewDto,
  ) {
    const review = await this.reviewsService.updateReview(reviewId, data);
    return review;
  }

  @Patch('best/:id/title')
  async updateReviewBestTitle(
    @Param('id') reviewId: number,
    @Body() data: UpdateReviewDto,
  ) {
    const review = await this.reviewsService.updateReview(reviewId, data);
    return review;
  }

  @Post('best/:id')
  @UseGuards(AuthGuard('jwt-admin'))
  async updateReviewBest(
    @Param('id') reviewId: number,
    @User() user: TokenPayloadDto,
  ) {
    if (user.authority !== 'MANAGER' || !user.authority) {
      throw new ForbiddenException(
        'You are not authorized to update this review',
      );
    }
    const review = await this.reviewsService.updateReviewBest(reviewId);
    return review;
  }

  @Delete('best/:id')
  @UseGuards(AuthGuard('jwt-admin'))
  async deleteReviewBest(
    @Param('id') reviewId: number,
    @User() user: TokenPayloadDto,
  ) {
    if (user.authority !== 'MANAGER' || !user.authority) {
      throw new ForbiddenException(
        'You are not authorized to delete this review',
      );
    }
    const review = await this.reviewsService.updateReviewNotBest(reviewId);
    return review;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteReview(@Param('id') reviewId: number) {
    const review = await this.reviewsService.deleteReview(reviewId);
    return review;
  }
}

import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'rating is required' })
  @IsNumber({}, { message: 'rating must be a number' })
  @Transform(({ value }) => parseInt(value))
  rating: number;

  @IsNotEmpty({ message: 'comment is required' })
  @IsString({ message: 'comment must be a string' })
  comment: string;

  @IsNotEmpty({ message: 'accommodationId is required' })
  @IsNumber({}, { message: 'accommodationId must be a number' })
  @Transform(({ value }) => parseInt(value))
  accommodationId: number;
}

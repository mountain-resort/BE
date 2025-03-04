import {
  IsNotEmpty,
  Length,
  IsString,
  IsUrl,
  IsOptional,
  IsArray,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';

const LIMIT = {
  name: { min: 1, max: 100 },
  description: { min: 10, max: 300 },
  overview: { min: 10, max: 300 },
};

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name is required' })
  @IsString({ message: 'Category name must be a string' })
  @Length(LIMIT.name.min, LIMIT.name.max, {
    message: `Category name must be between ${LIMIT.name.min} and ${LIMIT.name.max} characters`,
  })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @Length(LIMIT.description.min, LIMIT.description.max, {
    message: `Description must be between ${LIMIT.description.min} and ${LIMIT.description.max} characters`,
  })
  description: string;

  @IsNotEmpty({ message: 'Overview is required' })
  @IsString({ message: 'Overview must be a string' })
  @Length(LIMIT.overview.min, LIMIT.overview.max, {
    message: `Overview must be between ${LIMIT.overview.min} and ${LIMIT.overview.max} characters`,
  })
  overview: string;

  @IsNotEmpty({ message: 'Related activities are required' })
  @IsArray({ message: 'Activities must be an array' })
  @IsNumber({}, { each: true, message: 'Each activity ID must be a number' })
  @ArrayMinSize(1, { message: 'At least one activity must be provided' })
  activityIds: number[];

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  heroImageUrl: string;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl: string;

  @IsNumber()
  adminId: number;
}

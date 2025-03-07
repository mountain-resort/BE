import {
  IsNotEmpty,
  Length,
  IsString,
  IsUrl,
  IsOptional,
} from 'class-validator';

const LIMIT = {
  name: { min: 1, max: 100 },
  description: { min: 10, max: 300 },
};

export class CreateActivityDto {
  @IsNotEmpty({ message: 'Activity name is required' })
  @IsString({ message: 'Activity name must be a string' })
  @Length(LIMIT.name.min, LIMIT.name.max, {
    message: `Activity name must be between ${LIMIT.name.min} and ${LIMIT.name.max} characters`,
  })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @Length(LIMIT.description.min, LIMIT.description.max, {
    message: `Description must be between ${LIMIT.description.min} and ${LIMIT.description.max} characters`,
  })
  description: string;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl: string;
}

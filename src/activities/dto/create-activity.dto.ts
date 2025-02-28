import {
  IsNotEmpty,
  Length,
  IsString,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty({ message: 'Activity name is required' })
  @IsString({ message: 'Activity name must be a string' })
  @Length(3, 100, {
    message: 'Activity name must be between 3 and 100 characters',
  })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @Length(30, 300, {
    message: 'Description must be between 30 and 300 characters',
  })
  description: string;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl: string;
}

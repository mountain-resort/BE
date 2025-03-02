import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateDiningDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @Length(30, 300, {
    message: 'Description must be between 30 and 300 characters',
  })
  description: string;

  @IsNotEmpty({ message: 'Trading hours is required' })
  @IsString({ message: 'Trading hours must be a string' })
  tradingHours: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @Length(30, 300, {
    message: 'Content must be between 30 and 300 characters',
  })
  content: string;

  @IsNotEmpty({ message: 'Location is required' })
  @IsString({ message: 'Location must be a string' })
  location: string;

  @IsNotEmpty({ message: 'Menu URL is required' })
  @IsString({ message: 'Menu URL must be a string' })
  menuUrl: string;

  @IsNotEmpty({ message: 'Image URL is required' })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl: string;
}

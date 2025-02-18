import { Authority } from '@prisma/client';
import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAdminDto {
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.trim())
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString({ message: 'Mobile must be a string' })
  @IsNotEmpty({ message: 'Mobile is required' })
  @Transform(({ value }) => value?.trim())
  mobile: string;

  @IsEnum(Authority, { message: 'Authority must be a valid authority' })
  @IsNotEmpty({ message: 'Authority is required' })
  authority: Authority;
}

import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsDate()
  checkInDate: Date;

  @IsNotEmpty()
  @IsDate()
  checkOutDate: Date;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  priceAtBooking: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  roomTypeId: number;
}

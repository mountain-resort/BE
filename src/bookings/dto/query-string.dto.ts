import { DefaultQueryStringDto } from 'src/common/dto/default-query-string.dto';
import {
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BookingStatus } from '@prisma/client';
export class QueryStringDto extends DefaultQueryStringDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsOptional()
  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  roomType: number;

  @IsOptional()
  @IsString()
  isToday: string;
}

import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

type OrderByType = 'asc' | 'desc';

export class DefaultQueryStringDto {
  @IsOptional()
  @IsString()
  keyword: string = '';

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  orderBy: OrderByType = 'desc';

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page: number = 1;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  pageSize: number = 10;

  @IsString()
  @IsOptional()
  isDeleted: string;
}

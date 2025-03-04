import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class DefaultQueryStringDto {
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  keyword: string = '';

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  orderBy: 'asc' | 'desc' = 'desc';

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

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return null;
    return Number(value);
  })
  cursor: number | null = null;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return 10;
    const num = Number(value);
    return num > 0 ? num : 10;
  })
  limit: number = 10;

  @IsString()
  @IsOptional()
  language: string;
}

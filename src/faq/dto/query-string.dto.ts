import { IsOptional, IsString } from 'class-validator';

export class QueryStringDto {
  @IsOptional()
  @IsString()
  keyword: string;
  @IsOptional()
  @IsString()
  sortBy: string;
  @IsOptional()
  @IsString()
  orderBy: string;
}

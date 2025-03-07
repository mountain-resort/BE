import { IsOptional, IsString, IsIn } from 'class-validator';
import { DefaultQueryStringDto } from 'src/common/dto/default-query-string.dto';
import { Authority } from '@prisma/client';
import { Transform } from 'class-transformer';
export class QueryStringDto extends DefaultQueryStringDto {
  @IsOptional()
  @IsString()
  @IsIn(Object.values(Authority))
  @Transform(({ value }) => value.toUpperCase())
  auth?: string;
}

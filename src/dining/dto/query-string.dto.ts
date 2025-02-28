import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { DefaultQueryStringDto } from 'src/common/dto/default-query-string.dto';
import { DiningType } from '@prisma/client';
export class QueryStringDto extends DefaultQueryStringDto {  
  @IsString()
  @IsOptional()
  type?: DiningType;
}
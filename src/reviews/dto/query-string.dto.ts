import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { DefaultQueryStringDto } from 'src/common/dto/default-query-string.dto';

export class QueryStringDto extends DefaultQueryStringDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  roomType?: number;

  @IsOptional()
  @IsString()
  isBest?: string;
}

import { IsOptional } from 'class-validator';
import { DefaultQueryStringDto } from 'src/common/dto/default-query-string.dto';
import { Transform } from 'class-transformer';
export class QueryStringDto extends DefaultQueryStringDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return false;
  })
  ongoing: boolean = false;
}

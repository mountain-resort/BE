import { IsString } from 'class-validator';
import { DefaultQueryStringDto } from 'src/common/dto/default-query-string.dto';

export class AnnouncementListQueryDto extends DefaultQueryStringDto {
  @IsString()
  isDeleted: string;
}

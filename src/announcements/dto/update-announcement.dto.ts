import { CreateAnnouncementDto } from './create-announcement.dto';
import { PartialType } from '@nestjs/mapped-types';
export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateDiningDto } from './create-dining.dto';

export class UpdateDiningDto extends PartialType(CreateDiningDto) {}

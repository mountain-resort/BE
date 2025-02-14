import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create.member';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}

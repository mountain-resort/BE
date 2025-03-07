import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  fileUrl: string;

  @IsOptional()
  imageUrl: string;
}

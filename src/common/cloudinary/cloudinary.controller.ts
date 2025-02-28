import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('uploads')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/i }), // regex 패턴 수정
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder: string = 'default',
  ) {
    const imageUrl = await this.cloudinaryService.uploadImage(file, folder);
    return { imageUrl };
  }
}

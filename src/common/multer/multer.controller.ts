import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('files')
export class MulterController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/i }),
        ],
        errorHttpStatusCode: 400,
        exceptionFactory: (error) =>
          new BadRequestException(
            'Only image files are allowed (jpg, jpeg, png, gif). Maximum size is 5MB.',
          ),
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder: string = 'images',
  ) {
    const imageUrl = await this.cloudinaryService.uploadFile(file, folder);
    return { url: imageUrl };
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(pdf|xlsx|xls|ods|doc|docx)$/i }),
        ],
        errorHttpStatusCode: 400,
        exceptionFactory: (error) =>
          new BadRequestException(
            'Only document files are allowed (pdf, xlsx, xls, ods, doc, docx). Maximum size is 10MB.',
          ),
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder: string = 'documents',
  ) {
    const documentUrl = await this.cloudinaryService.uploadFile(file, folder);
    return { url: documentUrl };
  }
}

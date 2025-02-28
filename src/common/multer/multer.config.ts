import { MulterModuleOptions } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ConfigService } from '@nestjs/config';

export const MulterConfigProvider = {
  provide: 'MULTER_CONFIG',
  useFactory: (configService: ConfigService): MulterModuleOptions => {
    return {
      storage: multer.memoryStorage(), // 메모리에 파일 저장 (Cloudinary로 전송 위함)
      limits: {
        fileSize: configService.get<number>('MAX_FILE_SIZE', 10 * 1024 * 1024), // 기본 10MB 제한
      },
      fileFilter: (req, file, callback) => {
        // 허용되는 파일 형식 목록
        const allowedMimetypes = [
          // 이미지 형식
          'image/jpeg',
          'image/png',
          'image/gif',
          // PDF 형식
          'application/pdf',
          // Excel 형식
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.oasis.opendocument.spreadsheet',
        ];

        if (allowedMimetypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error(
              'Unsupported file type. Only images, PDF or Excel files are allowed.',
            ),
            false,
          );
        }
      },
    };
  },
  inject: [ConfigService],
};

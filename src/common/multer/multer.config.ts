import { MulterModuleOptions } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

export const MulterConfigProvider = {
  provide: 'MULTER_CONFIG',
  useFactory: (configService: ConfigService): MulterModuleOptions => {
    return {
      storage: multer.memoryStorage(), // 메모리에 파일 저장 (Cloudinary로 전송 위함)
      limits: {
        fileSize: configService.get<number>('MAX_FILE_SIZE', 10 * 1024 * 1024), // 기본 10MB 제한
      },
      fileFilter: (req, file, callback) => {
        // 허용된 MIME 타입 목록
        const allowedMimetypes = [
          // 이미지
          'image/jpeg',
          'image/png',
          'image/gif',
          // PDF
          'application/pdf',
          // Excel
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.oasis.opendocument.spreadsheet',
        ];

        try {
          if (allowedMimetypes.includes(file.mimetype)) {
            callback(null, true);
          } else {
            callback(
              new BadRequestException(
                'Unsupported file type. Only images, PDF or Excel files are allowed.',
              ),
              false,
            );
          }
        } catch (error) {
          callback(
            new BadRequestException(`File upload error: ${error.message}`),
            false,
          );
        }
      },
    };
  },
  inject: [ConfigService],
};

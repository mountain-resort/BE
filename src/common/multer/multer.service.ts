import { Injectable, BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as path from 'path';

@Injectable()
export class MulterService {
  /**
   * 허용된 파일 확장자 목록을 기반으로 파일 필터를 생성.
   *
   * @param allowedTypes - 허용할 파일 확장자 배열 (예: ['.jpg', '.pdf'])
   * @returns Multer의 fileFilter 함수
   */
  getFileFilter(allowedTypes: string[]): MulterOptions['fileFilter'] {
    return (req, file, callback) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        callback(null, true); // 파일 허용
      } else {
        callback(
          new BadRequestException(
            `Unsupported file type. Allowed types: ${allowedTypes.join(', ')}`,
          ),
          false, // 파일 거부
        );
      }
    };
  }

  /**
   * 이미지 파일 업로드를 위한 Multer 설정을 반환.
   *
   * @returns 이미지 파일에 최적화된 MulterOptions
   */
  getImageOptions(): MulterOptions {
    return {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
      fileFilter: this.getFileFilter(['.jpg', '.jpeg', '.png', '.gif']),
    };
  }

  /**
   * 문서 파일 업로드를 위한 Multer 설정을 반환.
   *
   * @returns 문서 파일에 최적화된 MulterOptions
   */
  getDocumentOptions(): MulterOptions {
    return {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
      fileFilter: this.getFileFilter(['.pdf', '.doc', '.docx', '.txt']),
    };
  }
}

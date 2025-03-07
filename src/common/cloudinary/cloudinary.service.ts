import { v2 as cloudinary } from 'cloudinary';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';

type CloudinaryResourceType = 'image' | 'video' | 'raw' | 'auto';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  /**
   * 파일을 Cloudinary에 업로드합니다.
   * 내부적으로 예외를 처리하여 상위 레이어에 전파하지 않습니다.
   *
   * @param file - 업로드할 파일 (Express.Multer.File 타입)
   * @param folder - 파일을 저장할 Cloudinary 폴더 이름 (기본값: 'default')
   * @returns 업로드된 파일의 URL을 담은 Promise
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'files',
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required for upload');
    }

    try {
      // 파일 타입에 따라 리소스 타입 결정
      const resourceType = this.getResourceType(file.mimetype);

      // Promise를 반환하여 비동기 처리
      return new Promise((resolve, reject) => {
        // Cloudinary 업로드 스트림 생성
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
          },
          (error, result) => {
            // 업로드 완료 후 콜백 처리
            if (error) return reject(error);
            resolve(result.secure_url);
          },
        );

        // 파일 버퍼를 스트림으로 전송하여 업로드
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      // 모든 에러를 BadRequestException으로 변환하여 일관된 에러 처리
      throw new BadRequestException(
        `Failed to upload file to Cloudinary: ${error.message}`,
      );
    }
  }

  /**
   * 기존 이미지 업로드 메서드 (하위 호환성을 위해 유지)
   * 내부적으로 uploadFile을 호출하고 추가 예외 처리를 수행합니다.
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'images',
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('image is required for upload');
    }

    try {
      return await this.uploadFile(file, folder);
    } catch (error) {
      // Cloudinary 관련 에러를 이미지에 특화된 메시지로 변환
      if (error instanceof BadRequestException) {
        throw error; // 이미 BadRequestException인 경우 그대로 전달
      }
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * MIME 타입을 기반으로 Cloudinary 리소스 타입을 결정합니다.
   */
  private getResourceType(mimetype: string): CloudinaryResourceType {
    if (mimetype.startsWith('image/')) {
      return 'image';
    } else if (mimetype.startsWith('video/')) {
      return 'video';
    } else {
      return 'raw'; // PDF, Excel 등의 파일은 'raw' 타입으로 처리
    }
  }
}

import { v2 as cloudinary } from 'cloudinary';
import { Injectable, Inject } from '@nestjs/common';

// Cloudinary 리소스 타입 정의
type CloudinaryResourceType = 'image' | 'video' | 'raw' | 'auto';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  /**
   *
   * @param file - 업로드할 파일 (Express.Multer.File 타입)
   * @param folder - 파일을 저장할 Cloudinary 폴더 이름 (기본값: 'default') / 이미지는 images 폴더에, 문서는 documents 폴더에
   * @returns 업로드된 파일의 URL을 담은 Promise
   *
   * @example
   * // 파일 업로드 예시
   * const imageUrl = await cloudinaryService.uploadFile(file, 'images');
   * const fileUrl = await cloudinaryService.uploadFile(file, 'documents');
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'default',
  ): Promise<string> {
    // 파일 타입에 따라 리소스 타입 결정
    const resourceType = this.getResourceType(file.mimetype);

    // Promise를 반환하여 비동기 처리
    return new Promise((resolve, reject) => {
      // Cloudinary 업로드 스트림 생성
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType, // raw, image 등으로 설정
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
  }

  /**
   * 기존 이미지 업로드 메서드 (하위 호환성을 위해 유지)
   * uploadFile 메서드를 내부적으로 호출합.
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'default',
  ): Promise<string> {
    return this.uploadFile(file, folder);
  }

  /**
   * MIME 타입을 기반으로 Cloudinary 리소스 타입을 결정.
   *
   * @param mimetype - 파일의 MIME 타입
   * @returns Cloudinary 리소스 타입 (image, raw, video 등)
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

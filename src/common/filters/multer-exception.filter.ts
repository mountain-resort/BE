import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpErrorDto } from '../dto/http-error.dto';
import { MulterError } from 'multer';
@Catch(MulterError) // 모든 예외 처리
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log('filter in multer exception'); // 어느 예외 처리 필터에서 예외가 발생했는지 확인하기 위해 출력
    console.log('Exception type:', exception.constructor.name); // 예외 타입 출력
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Multer 관련 에러인지 확인
    if (
      exception.message &&
      (exception.message.includes('file type') ||
        exception.message.includes('file size') ||
        exception.message.includes('Only images'))
    ) {
      const errorResponse: HttpErrorDto = {
        path: request.path,
        method: request.method,
        status: HttpStatus.BAD_REQUEST,
        message: exception.message,
        date: new Date(),
      };

      console.log(errorResponse);
      return response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    }

    // Multer 관련 에러가 아니면 다음 필터로 전달
    throw exception;
  }
}

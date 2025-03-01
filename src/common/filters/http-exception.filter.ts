import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // ValidationPipe 오류 처리 (class-validator 오류 포함)
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const exceptionObj = exceptionResponse as any;

        // class-validator 검증 오류는 메시지에 모두 포함
        if (Array.isArray(exceptionObj.message)) {
          message = exceptionObj.message.join('. ');
        } else if (exceptionObj.message) {
          message = exceptionObj.message;
        }
      }
    }
    // Prisma 오류 처리
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'id not found';
      } else if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        const target = exception.meta?.target ? `${exception.meta.target}` : '';
        message = `Duplicate entry: ${target} already exists`;
      } else {
        message = `Database error: ${exception.code}`;
      }
    }
    // Multer 관련 오류 처리
    else if (
      exception.message &&
      (exception.message.includes('file type') ||
        exception.message.includes('file size') ||
        exception.message.includes('Only images'))
    ) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else {
      console.error('Unhandled exception:', exception);
    }

    console.log({
      path: request.path,
      method: request.method,
      status,
      message,
      error: exception,
      date: new Date(),
    });

    response.status(status).json({
      path: request.path,
      method: request.method,
      status,
      message,
      date: new Date(),
    });
  }
}

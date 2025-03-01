import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpErrorDto } from '../dto/http-error.dto';
@Catch() // 모든 예외 처리
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log('filter in http exception'); // 어느 예외 처리 필터에서 예외가 발생했는지 확인하기 위해 출력
    console.log('Exception type:', exception.constructor.name); // 예외 타입 출력
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.createErrorResponse(exception, request);

    // 로깅
    console.log(errorResponse);

    response.status(errorResponse.status).json(errorResponse);
  }

  private createErrorResponse(
    exception: Error,
    request: Request,
  ): HttpErrorDto {
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    return {
      path: request.path,
      method: request.method,
      status,
      message,
      date: new Date(),
    };
  }

  private getStatus(exception: Error): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: Error): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        const exceptionObj = response as any;
        if (Array.isArray(exceptionObj.message)) {
          return exceptionObj.message.join('. ');
        }
        return exceptionObj.message || exception.message;
      }
    }
    return exception.message || 'Internal Server Error';
  }
}

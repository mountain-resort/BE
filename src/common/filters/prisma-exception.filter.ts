import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log('filter in prisma exception'); // 어느 예외 처리 필터에서 예외가 발생했는지 확인하기 위해 출력
    console.log('Exception type:', exception.constructor.name); // 예외 타입 출력

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const result = this.handlePrismaError(exception);
      status = result.status;
      message = result.message;
    }

    const errorResponse = {
      path: request.path,
      method: request.method,
      status,
      message,
      date: new Date(),
    };

    console.log(errorResponse);
    response.status(status).json(errorResponse);
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    // 예외 코드 처리 prisma 예외 코드 참고
    switch (error.code) {
      // 레코드 없음
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Record not found',
        };
      // 중복 레코드
      case 'P2002': {
        const target = error.meta?.target ? `${error.meta.target}` : '';
        return {
          status: HttpStatus.CONFLICT,
          message: `Duplicate entry: ${target} already exists`,
        };
      }
      // 외래키 오류
      case 'P2003': {
        const target = error.meta?.target ? `${error.meta.target}` : '';
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Invalid foreign key: ${target}`,
        };
      }
      // 잘못된 입력
      case 'P2004': {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Invalid input: ${error.meta?.target}`,
        };
      }
      // 기본 예외 처리
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Database error: ${error.code}`,
        };
    }
  }
}

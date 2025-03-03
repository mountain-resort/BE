import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { DefaultQueryStringDto } from '../dto/default-query-string.dto';
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
    const language = (request.query.language as string) || 'en';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const target = exception.meta?.target ? `${exception.meta.target}` : '';
      const result = this.handlePrismaError(language, exception, target);
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

  private handlePrismaError(
    language: string,
    error: Prisma.PrismaClientKnownRequestError,
    target?: string,
  ): {
    status: number;
    message: string;
  } {
    // 예외 코드 처리 prisma 예외 코드 참고
    switch (error.code) {
      // 레코드 없음
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: this.responseMessage(error, target)[language],
        };
      // 중복 레코드
      case 'P2002': {
        const target = error.meta?.target ? `${error.meta.target}` : '';
        return {
          status: HttpStatus.CONFLICT,
          message: this.responseMessage(error, target)[language],
        };
      }
      // 외래키 오류
      case 'P2003': {
        const target = error.meta?.target ? `${error.meta.target}` : '';
        return {
          status: HttpStatus.BAD_REQUEST,
          message: this.responseMessage(error, target)[language],
        };
      }
      // 잘못된 입력
      case 'P2004': {
        const target = error.meta?.target ? `${error.meta.target}` : '';
        return {
          status: HttpStatus.BAD_REQUEST,
          message: this.responseMessage(error, target)[language],
        };
      }
      // 기본 예외 처리
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: this.responseMessage(error)[language],
        };
    }
  }

  private responseMessage(
    error: Prisma.PrismaClientKnownRequestError,
    target?: string,
  ) {
    switch (error.code) {
      case 'P2025':
        return {
          ko: '존재하지 않는 레코드입니다.',
          en: 'Record not found',
        };
      case 'P2002':
        return {
          ko: '중복된 레코드입니다.',
          en: `Duplicate entry: ${target} already exists`,
        };
      case 'P2003':
        return {
          ko: '외래키 오류입니다.',
          en: `Invalid foreign key: ${target}`,
        };
      case 'P2004':
        return {
          ko: '잘못된 입력입니다.',
          en: `Invalid input: ${target}`,
        };
      default:
        return {
          ko: '데이터베이스 오류입니다.',
          en: `Database error: ${error.code}`,
        };
    }
  }
}

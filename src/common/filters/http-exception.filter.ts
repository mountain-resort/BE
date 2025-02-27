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
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      //prisma findUniqueOrThrow 했을때 던지는 오류
      if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'id not found';
      }
    }

    console.log({
      path: request.path,
      method: request.method,
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

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const allowedOrigins: string[] = ['http://localhost:3001'];
  // CORS 설정
  const corsOptions: CorsOptions = {
    credentials: true,
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, origin?: string) => void,
    ) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // 허용
      } else {
        callback(new Error('Not allowed by CORS')); // 허용하지 않음
      }
    },
    exposedHeaders: ['set-cookie'],
  };

  app.enableCors(corsOptions);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  });
}
bootstrap();

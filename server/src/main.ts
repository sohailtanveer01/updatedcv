import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // const appUrl = configService.get('app.url');

  const appUrl = process.env.PUBLIC_URL
  console.log("this is appurl",appUrl)
  

  // Middleware
  app.enableCors({ origin: [appUrl], credentials: true });
  app.enableShutdownHooks();
  app.use(cookieParser());

  // Pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Server Port
  // const port = configService.get<number>('app.port');
  const port = process.env.PORT || 3100
  await app.listen(port);
  console.log("rhis is my port no",port)
  Logger.log(`🚀 Server is up and running!`);
};

bootstrap();

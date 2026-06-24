import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.enableCors({
      origin: [
        process.env.DEV_FRONTEND_DASHBOARD,
        process.env.PROD_FRONTEND_DASHBOARD,
        process.env.DEV_FRONTEND_MAINSITE,
        process.env.PROD_FRONTEND_MAINSITE,
      ],
      credentials: true,
    });

    await app.init();
  }

  return app;
}

export default bootstrap;

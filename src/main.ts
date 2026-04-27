import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors([
    process.env.DEV_FRONTEND_DASHBOARD,
    process.env.PROD_FRONTEND_DASHBOARD,
    process.env.DEV_FRONTEND_MAINSITE,
    process.env.PROD_FRONTEND_MAINSITE,
  ]);
  await app.listen(process.env.PORT ?? 3000).catch((err) => {
    console.log(err);
  });
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

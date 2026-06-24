import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';

import express from 'express';
import serverlessExpress from '@vendia/serverless-express';

const expressApp = express();

let cachedServer;

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  await app.init();

  return serverlessExpress({
    app: expressApp,
  });
}

export default async function handler(req, res) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  return cachedServer(req, res);
}

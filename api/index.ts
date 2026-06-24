import serverlessExpress from '@vendia/serverless-express';
import bootstrap from '../src/main';

let cachedServer;

async function handler(req, res) {
  if (!cachedServer) {
    const app = await bootstrap();
    const expressApp = app.getHttpAdapter().getInstance();

    cachedServer = serverlessExpress({
      app: expressApp,
    });
  }

  return cachedServer(req, res);
}

export default handler;

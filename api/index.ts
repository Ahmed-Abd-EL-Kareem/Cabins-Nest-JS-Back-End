import bootstrap from '../src/main';

let app;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await bootstrap();
  }

  const expressApp = app.getHttpAdapter().getInstance();

  return expressApp(req, res);
}

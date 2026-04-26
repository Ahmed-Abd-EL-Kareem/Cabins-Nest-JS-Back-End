import { registerAs } from '@nestjs/config';

export default registerAs('mailConfig', () => ({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT ?? '465'),
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  from: process.env.MAIL_FROM,
  frontendUrl: process.env.FRONTEND_URL,
}));

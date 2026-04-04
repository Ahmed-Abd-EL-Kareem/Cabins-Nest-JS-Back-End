import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  cloudInaryName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudInaryKey: process.env.CLOUDINARY_API_KEY,
  cloudInarySecret: process.env.CLOUDINARY_API_SECRET,
  mailHost: process.env.MAIL_HOST,
  mailUserName: process.env.SMTP_USERNAME,
  mailPassword: process.env.SMTP_PASSWORD,
}));

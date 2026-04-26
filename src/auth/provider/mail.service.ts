import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import mailConfig from '../config/mail.config';
import { type ConfigType } from '@nestjs/config';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailCfg: ConfigType<typeof mailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.mailCfg.host,
      port: this.mailCfg.port,
      secure: false, // false for port 587 (STARTTLS), true only for port 465 (SSL)
      requireTLS: true, // force STARTTLS upgrade
      tls: {
        rejectUnauthorized: false, // helps in dev/local environments
      },
      auth: {
        user: this.mailCfg.user,
        pass: this.mailCfg.password,
      },
    });
  }

  async sendPasswordResetEmail(toEmail: string, token: string): Promise<void> {
    const resetUrl = `${this.mailCfg.frontendUrl}/reset-password?token=${token}`;
    try {
      await this.transporter.sendMail({
        from: this.mailCfg.from,
        to: toEmail,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset</h2>
          <p>You requested a password reset. Click the link below to reset your password.</p>
          <p>This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" style="
            display:inline-block;
            padding:12px 24px;
            background:#4F46E5;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
          ">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to send reset email',
      );
    }
  }
}

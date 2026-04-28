import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { OAuth2Client } from 'google-auth-library';
import { type ConfigType } from '@nestjs/config';
import googleOauthConfig from '../config/google-oauth.config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private client: OAuth2Client;

  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'token',
      passwordField: 'token',
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    this.client = new OAuth2Client(this.googleConfig.googleClientId!);
  }

  async validate(token: string): Promise<any> {
    if (!token) {
      throw new UnauthorizedException('Google token is missing');
    }

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.googleConfig.googleClientId!,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return await this.authService.validateGoogleUser({
        googleId: payload.sub,
        email: payload.email!,
        fullName: payload.name ?? payload.email!,
        avatar: payload.picture,
      });
    } catch {
      throw new UnauthorizedException('Google token verification failed');
    }
  }
}

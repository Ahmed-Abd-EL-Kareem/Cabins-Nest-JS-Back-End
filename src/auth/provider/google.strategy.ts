import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    /**
     * Inject GoogleConfig
     */
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
    /**
     * Inject authservice
     */
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleConfig.googleClientId!,
      clientSecret: googleConfig.googleSecret!,
      callbackURL: googleConfig.callbackUrl!,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, name, emails, photos } = profile;
    const user = await this.authService.validateGoogleUser({
      googleId: id,
      email: emails![0].value,
      fullName: `${name!.givenName} ${name!.familyName}`,
      avatar: photos?.[0]?.value,
    });
    done(null, user);
  }
}

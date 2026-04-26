import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import JwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt.interface';
import { UsersService } from 'src/users/provider/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    /**
     * Inject JwtConfig
     */
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
    /**
     * Inject userService
     */
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret!,
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOneById(payload.sub);
    return {
      userId: payload.sub,
      email: payload.email,
      role: user?.role,
    };
  }
}

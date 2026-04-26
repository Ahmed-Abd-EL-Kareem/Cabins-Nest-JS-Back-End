import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/provider/users.service';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { HashingProvider } from './hashing.provider';
import { User } from 'src/users/users.entity';
import { GoogleUserPayload } from '../interfaces/google-user-payload.interface';
import * as crypto from 'crypto';
import { MailService } from './mail.service';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject UsersService
     */
    private readonly usersService: UsersService,
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject hashingProvider
     */
    private readonly hashingProvider: HashingProvider,
    /**
     * Inject mailService
     */
    private readonly mailService: MailService,
    @Inject(jwtConfig.KEY)
    private readonly jwtCfg: ConfigType<typeof jwtConfig>,
  ) {}
  async validateUser(loginDto: LoginDto) {
    // console.log(loginDto.password);
    const user = await this.usersService.findOneByEmail(loginDto.email);
    // console.log(user);
    if (user && user.password) {
      const isMatch = await this.hashingProvider.comparePassword(
        loginDto.password,
        user.password,
      );

      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async validateGoogleUser(payload: GoogleUserPayload): Promise<User> {
    return this.usersService.findOrCreateGoogleUser(payload);
  }
  private generateTokens(user: User): LoginResponseDto {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtCfg.secret,
      expiresIn: this.jwtCfg.accessTokenTtl,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtCfg.refreshSecret,
      expiresIn: this.jwtCfg.refreshTokenTtl,
    });
    return { accessToken, refreshToken, user };
  }
  login(user: User): LoginResponseDto {
    return this.generateTokens(user);
  }
  async refreshTokens(userId: number): Promise<LoginResponseDto> {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new UnauthorizedException('User Not Found');
    return this.generateTokens(user);
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) return true;

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersService.setResetPasswordToken(user.id, token, expires);
    await this.mailService.sendPasswordResetEmail(user.email, token);
    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or Expired Rest Token');
    }
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }
    const hashedPassword = await this.hashingProvider.hashPassword(newPassword);
    await this.usersService.updatePasswordAndClearToken(
      user.id,
      hashedPassword,
    );
    return true;
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/provider/users.service';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { HashingProvider } from './hashing.provider';
import { User } from 'src/users/users.entity';

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

  login(user: User): LoginResponseDto {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}

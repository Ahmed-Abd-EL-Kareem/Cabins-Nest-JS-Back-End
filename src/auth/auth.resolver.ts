import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { AuthService } from './provider/auth.service';
import { GqlGoogleAuthGuard } from './guards/gql-google-auth.guard';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { User } from 'src/users/users.entity';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-passord.dto';
import { GqlJwtRefreshGuard } from './guards/gql-jwt-refresh.guard';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { Public } from 'src/common/public';
import { AuthenticatedUser } from './interfaces/jwt.interface';

@Resolver()
export class AuthResolver {
  constructor(
    /**
     * Inject AuthService
     */
    private readonly authService: AuthService,
  ) {}
  @Public()
  @Mutation(() => LoginResponseDto)
  @UseGuards(GqlAuthGuard)
  login(@Args('loginInput') loginDto: LoginDto, @Context() context) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.login(context.req.user);
  }

  @Public()
  @Mutation(() => LoginResponseDto)
  @UseGuards(GqlGoogleAuthGuard)
  googleLogin(
    @Args('googleTokenInput') _googleTokenDto: GoogleTokenDto,
    @Context() context: { req: { user: User } },
  ): LoginResponseDto {
    return this.authService.login(context.req.user);
  }

  @Public()
  @Mutation(() => LoginResponseDto)
  @UseGuards(GqlJwtRefreshGuard)
  async refreshToken(
    @Args('refreshTokenInput') _refreshTokenDto: RefreshTokenDto,
    @Context() context: { req: { user: AuthenticatedUser } },
  ): Promise<LoginResponseDto> {
    return this.authService.refreshTokens(context.req.user.userId);
  }

  @Public()
  @Mutation(() => Boolean)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<boolean> {
    // console.log(forgotPasswordDto);

    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Mutation(() => Boolean)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
// @Mutation(() => Boolean)
// @UseGuards(GqlAuthGuard) // Protect this so only users with a valid token can logout
// logout(@Context() context) {
//   const req = context.req as Request;
//   if (req.logout) {
//     req.logout((err: any) => {
//       if (err) throw err;
//     });
//   }
//   return true;
// }
// }

import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { AuthService } from './provider/auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    /**
     * Inject AuthService
     */
    private readonly authService: AuthService,
  ) {}
  @Mutation(() => LoginResponseDto)
  @UseGuards(GqlAuthGuard)
  login(@Args('loginInput') loginDto: LoginDto, @Context() context) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.login(context.req.user);
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
}

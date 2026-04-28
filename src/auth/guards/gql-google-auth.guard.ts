import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlGoogleAuthGuard extends AuthGuard('google') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<{ req: any }>().req;
    const args = ctx.getArgs<{ googleTokenInput: { token: string } }>();

    // passport-local reads usernameField and passwordField from body
    // both set to 'token' so passport-local passes the token to validate()
    req.body = {
      token: args.googleTokenInput?.token,
    };

    return req;
  }
}

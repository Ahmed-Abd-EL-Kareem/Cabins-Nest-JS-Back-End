import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlGoogleAuthGuard extends AuthGuard('google') {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<{ req: Request }>();
    const args = ctx.getArgs<{ googleTokenInput: string }>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (req as any).body = args.googleTokenInput ?? args;
    return req;
  }
}

import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlJwtRefreshGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<{ req: Request }>();
    const args = ctx.getArgs<{ refreshTokenInput: { refreshToken: string } }>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (req as any).body = args.refreshTokenInput;
    return req;
  }
}

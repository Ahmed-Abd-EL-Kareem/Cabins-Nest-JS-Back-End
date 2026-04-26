import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/users/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    /**
     * Inject Reflector
     */
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext<{ req: { user: User } }>().req.user;

    if (!user) throw new ForbiddenException('Not authenticated');

    const hasRole = requiredRoles.includes(user.role!);
    if (!hasRole) throw new ForbiddenException('Forbidden resource');
    return true;
  }
}

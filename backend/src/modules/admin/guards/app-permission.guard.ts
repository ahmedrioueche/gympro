import { UserRole } from '@ahmedrioueche/gympro-client';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../../common/schemas/user.schema';

@Injectable()
export class AppPermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>(
      'app_permission',
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      return false;
    }

    // Admins have full access
    if (user.role === UserRole.Admin) {
      return true;
    }

    // App Editors need the specific permission
    if (user.role === UserRole.AppEditor) {
      const hasPermission = user.appPermissions?.includes(requiredPermission);
      if (!hasPermission) {
        throw new ForbiddenException(
          `You do not have permission to ${requiredPermission}`,
        );
      }
      return true;
    }

    // Other roles are not allowed
    return false;
  }
}

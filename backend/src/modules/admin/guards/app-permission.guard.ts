import { UserRole } from '@ahmedrioueche/gympro-client';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../common/schemas/user.schema';

@Injectable()
export class AppPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'app_permission',
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const jwtUser = request.user;

    if (!jwtUser) {
      return false;
    }

    // Admins have full access (check JWT role first for speed)
    if (jwtUser.role === UserRole.Admin) {
      return true;
    }

    // For App Editors, fetch fresh permissions from DB to avoid stale JWT issues
    if (jwtUser.role === UserRole.AppEditor) {
      const freshUser = await this.userModel
        .findById(jwtUser.sub)
        .select('appPermissions')
        .lean()
        .exec();

      if (!freshUser) {
        return false;
      }

      const hasPermission =
        freshUser.appPermissions?.includes(requiredPermission);
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

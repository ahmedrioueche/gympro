import { UserRole } from '@ahmedrioueche/gympro-client';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../../../common/schemas/user.schema';

@Injectable()
export class AdminDashboardGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      return false;
    }

    if (user.role === UserRole.Admin || user.role === UserRole.AppEditor) {
      return true;
    }

    throw new ForbiddenException(
      'Access denied. Admin or App Editor role required.',
    );
  }
}

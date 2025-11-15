/**
 * Roles Guard - Role-Based Access Control (RBAC)
 *
 * This guard restricts access to endpoints based on user roles.
 * Use this when you need to restrict access to specific roles (e.g., only Owner).
 *
 * @example
 * ```typescript
 * @Delete(':id')
 * @UseGuards(RolesGuard)
 * @Roles(UserRole.Owner)
 * async delete(@Param('id') id: string) {
 *   // Only Owner can access this endpoint
 * }
 * ```
 *
 * @see README.md for detailed documentation
 */

import { UserErrorCode, UserRole } from '@gympro/client';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Metadata key used to store required roles on route handlers
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which roles can access an endpoint
 *
 * @param roles - One or more UserRole values that are allowed to access the endpoint
 * @returns A decorator that sets metadata for the RolesGuard
 *
 * @example
 * ```typescript
 * @Roles(UserRole.Owner)           // Only Owner
 * @Roles(UserRole.Owner, UserRole.Manager)  // Owner or Manager
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Guard that enforces role-based access control
 *
 * How it works:
 * 1. Reads the @Roles() decorator metadata from the route handler
 * 2. Gets the authenticated user from the request (set by JwtAuthGuard)
 * 3. Checks if the user's role matches any of the required roles
 * 4. Throws ForbiddenException if the user doesn't have the required role
 *
 * Note: This guard requires JwtAuthGuard to run first to populate req.user
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from @Roles() decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // Check method-level decorator first
        context.getClass(), // Fall back to class-level decorator
      ],
    );

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the request object and authenticated user
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // User should be set by JwtAuthGuard - if not, throw error
    if (!user) {
      throw new ForbiddenException({
        message: 'User not authenticated',
        errorCode: UserErrorCode.INSUFFICIENT_PERMISSIONS,
      });
    }

    // Check if user's role matches any of the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException({
        message: 'Insufficient permissions',
        errorCode: UserErrorCode.INSUFFICIENT_PERMISSIONS,
      });
    }

    return true;
  }
}

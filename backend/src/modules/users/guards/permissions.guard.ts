/**
 * Permissions Guard - Permission-Based Access Control (PBAC)
 *
 * This guard restricts access to endpoints based on specific permissions.
 * Permissions are defined per role in @ahmedrioueche/gympro-client.
 *
 * Use this when multiple roles should have access (e.g., both Owner and Manager).
 *
 * @example
 * ```typescript
 * @Get()
 * @UseGuards(PermissionsGuard)
 * @RequirePermission('canManageMembers')
 * async findAll() {
 *   // Owner and Manager both have canManageMembers permission
 * }
 * ```
 *
 * @see README.md for detailed documentation
 */

import {
  ErrorCode,
  RolePermissions,
  UserRole,
} from '@ahmedrioueche/gympro-client';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Metadata key used to store required permissions on route handlers
 */
export const PERMISSIONS_KEY = 'permissions';

// Define default permissions for global roles (Moved from client package)
const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  [UserRole.Owner]: {
    canManageMembers: true,
    canManageSubscriptions: true,
    canManageStaff: true,
    canViewFinancials: true,
    canAssignPrograms: true,
    canManageAppSubscriptions: true,
    canCustomizePermissions: true,
  },
  [UserRole.Manager]: {
    canManageMembers: true,
    canManageSubscriptions: true,
    canManageStaff: true,
    canAssignPrograms: true,
    canManageAppSubscriptions: true,
    canCustomizePermissions: true,
  },
  [UserRole.Receptionist]: {},
  [UserRole.Coach]: {
    canAssignPrograms: true,
  },
  [UserRole.Member]: {},
  [UserRole.Cleaner]: {},
  [UserRole.Maintenance]: {},
  [UserRole.Security]: {},
};

/**
 * Decorator to specify which permission is required to access an endpoint
 *
 * @param permission - A key from RolePermissions interface (e.g., 'canManageMembers')
 * @returns A decorator that sets metadata for the PermissionsGuard
 *
 * @example
 * ```typescript
 * @RequirePermission('canManageMembers')      // Requires canManageMembers
 * @RequirePermission('canAssignPrograms')     // Requires canAssignPrograms
 * ```
 */
export const RequirePermission = (permission: keyof RolePermissions) =>
  SetMetadata(PERMISSIONS_KEY, [permission]);

/**
 * Guard that enforces permission-based access control
 *
 * How it works:
 * 1. Reads the @RequirePermission() decorator metadata from the route handler
 * 2. Gets the authenticated user from the request (set by JwtAuthGuard)
 * 3. Looks up the user's role in ROLE_PERMISSIONS to get their permissions
 * 4. Checks if the user has the required permission(s)
 * 5. Throws ForbiddenException if the user doesn't have the required permission
 *
 * Permission lookup flow:
 * - User has role (e.g., 'owner')
 * - ROLE_PERMISSIONS['owner'] returns the permissions object
 * - Check if the required permission is true in that object
 *
 * Note: This guard requires JwtAuthGuard to run first to populate req.user
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required permissions from @RequirePermission() decorator metadata
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [
        context.getHandler(), // Check method-level decorator first
        context.getClass(), // Fall back to class-level decorator
      ],
    );

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Get the request object and authenticated user
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // User should be set by JwtAuthGuard - if not, throw error
    if (!user) {
      throw new ForbiddenException({
        message: 'User not authenticated',
        errorCode: ErrorCode.INSUFFICIENT_PERMISSIONS,
      });
    }

    // Get user's role and look up their permissions
    const userRole = user.role as UserRole;
    const userPermissions = ROLE_PERMISSIONS[userRole] || {};

    // Check if user has at least one of the required permissions
    const hasPermission = requiredPermissions.some((permission) => {
      return (
        userPermissions[permission as keyof typeof userPermissions] === true
      );
    });

    if (!hasPermission) {
      throw new ForbiddenException({
        message: 'Insufficient permissions',
        errorCode: ErrorCode.INSUFFICIENT_PERMISSIONS,
      });
    }

    return true;
  }
}

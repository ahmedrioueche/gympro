/**
 * Gym Permissions Guard - Gym-Specific Permission-Based Access Control
 *
 * This guard checks user's permissions for a SPECIFIC gym based on their membership.
 * It uses the new granular permission system (string-based: "members:view", "staff:manage")
 * stored in GymMembership.permissions array.
 *
 * Key differences from old PermissionsGuard:
 * - Checks gym-specific membership permissions, not global role
 * - Extracts gymId from request params
 * - Uses new string-based permission system
 * - Owner always has all permissions
 *
 * @example
 * ```typescript
 * @Get(':gymId/members')
 * @UseGuards(GymPermissionsGuard)
 * @RequireGymPermission('members:view')
 * async getMembers(@Param('gymId') gymId: string) {
 *   // Only accessible if user has 'members:view' permission for this gym
 * }
 * ```
 */

import { ErrorCode, GymPermission } from '@ahmedrioueche/gympro-client';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GymModel } from '../../gym/gym.schema';
import { GymMembershipModel } from '../../gymMembership/membership.schema';

/**
 * Metadata key for storing required gym permissions
 */
export const GYM_PERMISSIONS_KEY = 'gym_permissions';

/**
 * Decorator to require gym-specific permissions
 *
 * @param permissions - One or more permissions required to access the endpoint
 *
 * @example
 * @RequireGymPermission('members:view')           // Requires one permission
 * @RequireGymPermission('members:edit', 'members:delete')  // Requires any one
 */
export const RequireGymPermission = (...permissions: GymPermission[]) =>
  SetMetadata(GYM_PERMISSIONS_KEY, permissions);

/**
 * Guard that checks if user has required permissions for a specific gym
 *
 * How it works:
 * 1. Extracts gymId from request.params.gymId
 * 2. Checks if user is gym owner (always has all permissions)
 * 3. Finds user's membership for this gym
 * 4. Checks if membership.permissions includes required permission(s)
 *
 * @throws ForbiddenException if user lacks required permissions
 */
@Injectable()
export class GymPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel('GymMembership')
    private gymMembershipModel: Model<GymMembershipModel>,
    @InjectModel('GymModel')
    private gymModel: Model<GymModel>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from decorator
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requiredPermissions = this.reflector.getAllAndOverride<
      GymPermission[]
    >(GYM_PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    console.log('[GymPermissionsGuard] ==== START ====');
    console.log(
      '[GymPermissionsGuard] Required permissions:',
      requiredPermissions,
    );
    console.log('[GymPermissionsGuard] User ID:', user?.sub || user?._id);
    console.log('[GymPermissionsGuard] Request params:', request.params);
    console.log('[GymPermissionsGuard] Request body:', request.body);

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      console.log('[GymPermissionsGuard] ❌ No required permission specified');
      return true;
    }

    // User must be authenticated
    if (!user) {
      console.log('[GymPermissionsGuard] ❌ No user in request');
      throw new ForbiddenException({
        message: 'User not authenticated',
        errorCode: ErrorCode.UNAUTHORIZED,
      });
    }

    // Extract gymId from request params OR body
    const gymId =
      request.params.gymId || request.params.id || request.body.gymId;

    console.log('[GymPermissionsGuard] Gym ID extracted:', gymId);

    if (!gymId) {
      console.log('[GymPermissionsGuard] ❌ No gymId found');
      throw new ForbiddenException({
        message: 'Gym ID not found in request params or body',
        errorCode: ErrorCode.INVALID_REQUEST,
      });
    }

    // Find the gym and check ownership
    const gym = await this.gymModel.findById(gymId).exec();
    console.log('[GymPermissionsGuard] Gym found:', !!gym);
    console.log('[GymPermissionsGuard] Gym owner:', gym?.owner);

    if (!gym) {
      throw new ForbiddenException({
        message: 'Gym not found',
        errorCode: ErrorCode.GYM_NOT_FOUND,
      });
    }

    // Owner has all permissions
    // JWT payload has 'sub' field for user ID, not '_id'
    const userId = user.sub || user._id;

    if (gym.owner && userId) {
      // Convert both to strings for comparison
      const ownerId = gym.owner._id
        ? gym.owner._id.toString()
        : gym.owner.toString();
      const userIdStr = userId.toString ? userId.toString() : userId;

      console.log('[GymPermissionsGuard] Owner check:', {
        ownerId,
        userId: userIdStr,
        match: ownerId === userIdStr,
      });

      if (ownerId === userIdStr) {
        console.log(
          '[GymPermissionsGuard] ✅ Access granted - User is gym owner',
        );
        return true;
      }
    }

    // Find user's membership for this gym
    // Find user's membership for this gym
    const membershipQuery = {
      user: new Types.ObjectId(userId.toString()),
      gym: new Types.ObjectId(gymId.toString()),
      membershipStatus: 'active',
    };

    console.log(
      '[GymPermissionsGuard] Querying membership with:',
      membershipQuery,
    );

    const membership = await this.gymMembershipModel
      .findOne(membershipQuery)
      .exec();

    console.log('[GymPermissionsGuard] Membership found:', !!membership);

    if (!membership) {
      console.log('[GymPermissionsGuard] ❌ No active membership found');
      throw new ForbiddenException({
        message: 'You are not a member of this gym',
        errorCode: ErrorCode.INSUFFICIENT_PERMISSIONS,
      });
    }

    // Check if user has ANY of the required permissions
    const userPermissions = membership.permissions || [];
    console.log('[GymPermissionsGuard] User permissions:', userPermissions);

    const hasPermission = requiredPermissions.some((p) =>
      userPermissions.includes(p),
    );

    if (!hasPermission) {
      console.log(
        '[GymPermissionsGuard] ❌ Missing permissions. Required:',
        requiredPermissions,
        'Has:',
        userPermissions,
      );
      throw new ForbiddenException({
        message: `Missing required permissions: ${requiredPermissions.join(', ')}`,
        errorCode: ErrorCode.INSUFFICIENT_PERMISSIONS,
      });
    }

    console.log('[GymPermissionsGuard] ✅ Access granted');

    return true;
  }
}

/**
 * Gym Feature Guard - Subscription Plan Feature-Based Access Control
 *
 * This guard checks if the current gym's subscription plan includes
 * the required feature. It reads from `gym.appSubscription.plan.featurePackages`
 * which is synced from the owner's subscription.
 *
 * Works alongside GymPermissionsGuard (role-based) to provide feature gating.
 *
 * @example
 * ```typescript
 * @Get(':gymId/members')
 * @UseGuards(JwtAuthGuard, GymPermissionsGuard, GymFeatureGuard)
 * @RequireGymPermission('members:view')
 * @RequireFeature(GymManagerFeature.MEMBERS)
 * async getMembers(@Param('gymId') gymId: string) {
 *   // Only accessible if gym's plan includes MEMBERS feature
 * }
 * ```
 */

import { AppFeature } from '@ahmedrioueche/gympro-client';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GymModel } from '../../modules/gym/gym.schema';

/**
 * Metadata key for storing required features
 */
export const REQUIRED_FEATURES_KEY = 'required_features';

/**
 * Decorator to require gym subscription features
 *
 * @param features - One or more features required to access the endpoint
 *
 * @example
 * @RequireFeature(GymManagerFeature.MEMBERS)
 * @RequireFeature(GymManagerFeature.STORE, GymManagerFeature.INVENTORY)
 */
export const RequireFeature = (...features: AppFeature[]) =>
  SetMetadata(REQUIRED_FEATURES_KEY, features);

/**
 * Guard that checks if the gym's subscription plan includes the required features.
 *
 * How it works:
 * 1. Reads required features from @RequireFeature() metadata
 * 2. Extracts gymId from request params
 * 3. Loads the gym and checks gym.appSubscription.plan.featurePackages
 * 4. Flattens all features from feature packages
 * 5. Verifies ALL required features are present
 *
 * @throws ForbiddenException if gym's plan doesn't include required features
 */
@Injectable()
export class GymFeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(GymModel.name)
    private readonly gymModel: Model<GymModel>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeatures = this.reflector.get<AppFeature[]>(
      REQUIRED_FEATURES_KEY,
      context.getHandler(),
    );

    // No features required — pass through
    if (!requiredFeatures || requiredFeatures.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Admins always have full access
    if (user?.role === 'admin' || user?.dashboardAccess?.includes('admin')) {
      return true;
    }

    // Extract gymId from route params or body (some controllers use :id, some :gymId)
    const gymId =
      request.params?.gymId ||
      request.params?.id ||
      request.body?.gymId ||
      request.query?.gymId;

    if (!gymId) {
      throw new ForbiddenException(
        'Gym ID not found in request. Cannot verify feature access.',
      );
    }

    const gym = await this.gymModel.findById(gymId).lean().exec();

    if (!gym) {
      throw new ForbiddenException('Gym not found.');
    }

    // Get feature packages from the gym's synced subscription
    const subscription = gym.appSubscription as any;
    const featurePackages = subscription?.plan?.featurePackages || [];

    // Flatten all features from all packages
    const allFeatures: string[] = featurePackages.reduce(
      (acc: string[], pkg: any) => {
        return [...acc, ...(pkg.features || [])];
      },
      [],
    );

    // Check that ALL required features are present
    const hasAllFeatures = requiredFeatures.every((feature) =>
      allFeatures.includes(feature),
    );

    if (!hasAllFeatures) {
      throw new ForbiddenException(
        'Your gym subscription plan does not include this feature. Please upgrade your plan.',
      );
    }

    return true;
  }
}

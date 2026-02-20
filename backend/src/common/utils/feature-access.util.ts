import { AppFeature, UserRole } from '@ahmedrioueche/gympro-client';
import { User } from '../schemas/user.schema';

/**
 * Utility to check if a user has access to a specific application feature
 * within a gym context. Features are determined by the gym's effective
 * subscription (synced from the owner's plan).
 *
 * @param user - The authenticated user
 * @param feature - The feature to check access for
 * @param gym - The gym document with populated appSubscription
 */
export function checkFeatureAccess(
  user: User,
  feature: AppFeature,
  gym?: any,
): boolean {
  // Admins and App Editors have full access
  if (user.role === UserRole.Admin || user.dashboardAccess?.includes('admin')) {
    return true;
  }

  // Only gym management roles are restricted by app subscription features
  const isGymStaff =
    user.role === UserRole.Owner ||
    user.role === UserRole.Manager ||
    user.role === UserRole.Receptionist;

  if (!isGymStaff) {
    return true;
  }

  // Check from gym's synced subscription (covers all staff roles)
  const subscription = gym?.appSubscription;
  const featurePackages = subscription?.plan?.featurePackages || [];

  // Flatten all features from all assigned packages
  const allFeatures = featurePackages.reduce((acc: AppFeature[], pkg: any) => {
    return [...acc, ...(pkg.features || [])];
  }, []);

  return allFeatures.includes(feature);
}

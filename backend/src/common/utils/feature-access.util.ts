import { AppFeature, UserRole } from '@ahmedrioueche/gympro-client';
import { User } from '../schemas/user.schema';

/**
 * Utility to check if a user has access to a specific application feature.
 * Currently focuses on gym management features.
 */
export function checkFeatureAccess(user: User, feature: AppFeature): boolean {
  // Admins and App Editors have full access
  if (user.role === UserRole.Admin || user.dashboardAccess?.includes('admin')) {
    return true;
  }

  // Only gym management roles are restricted by app subscription features for now
  const isGymStaff =
    user.role === UserRole.Owner ||
    user.role === UserRole.Manager ||
    user.role === UserRole.Receptionist;

  if (!isGymStaff) {
    return true;
  }

  // Check if the user has an active subscription and if it includes the feature
  // Note: appSubscription and its plan should be populated for this check to work
  const subscription = user.appSubscription as any;
  const featurePackages = subscription?.plan?.featurePackages || [];

  // Flatten all features from all assigned packages
  const allFeatures = featurePackages.reduce((acc: AppFeature[], pkg: any) => {
    return [...acc, ...(pkg.features || [])];
  }, []);

  return allFeatures.includes(feature);
}

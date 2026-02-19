import { GymManagerFeature } from "@ahmedrioueche/gympro-client";
import { useUserStore } from "../store/user";

/**
 * Hook to check if the current user has access to a specific feature.
 * Currently supports Gym Manager features based on the app subscription plan.
 */
export function useFeatureAccess() {
  const { user } = useUserStore();

  const hasFeature = (feature: GymManagerFeature): boolean => {
    // Admins and App Editors have full access
    if (user?.role === "admin" || user?.dashboardAccess?.includes("admin")) {
      return true;
    }

    // Only gym management roles are restricted by app subscription features for now
    const isGymStaff =
      user?.role === "owner" ||
      user?.role === "manager" ||
      user?.role === "receptionist";

    if (!isGymStaff) {
      return true;
    }

    // If no user or no subscription found, default to false (or true depending on free tier)
    // Here we assume if they are gym staff, they MUST have a plan that includes the feature.
    const featurePackages = user?.appSubscription?.plan?.featurePackages || [];

    // Flatten all features from all assigned packages
    const allFeatures = featurePackages.reduce(
      (acc: string[], pkg: any) => [...acc, ...(pkg.features || [])],
      [],
    );

    // Check if the feature is in the plan
    return allFeatures.includes(feature);
  };

  return { hasFeature };
}

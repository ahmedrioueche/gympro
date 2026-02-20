import { GymManagerFeature } from "@ahmedrioueche/gympro-client";
import { useGymStore } from "../store/gym";
import { useUserStore } from "../store/user";

/**
 * Hook to check if the current user has access to a specific feature.
 * Features are determined by the gym's effective subscription
 * (synced from the owner's plan), so all gym staff inherit access.
 */
export function useFeatureAccess() {
  const { user } = useUserStore();
  const { currentGym } = useGymStore();

  const hasFeature = (feature: GymManagerFeature): boolean => {
    // Admins and App Editors have full access
    if (user?.role === "admin" || user?.dashboardAccess?.includes("admin")) {
      return true;
    }

    // Only gym management roles are restricted by app subscription features
    const isGymStaff =
      user?.role === "owner" ||
      user?.role === "manager" ||
      user?.role === "receptionist";

    if (!isGymStaff) {
      return true;
    }

    // Check from the gym's synced subscription (covers all staff roles)
    console.log("currentGym", currentGym);
    const subscription = currentGym?.appSubscription;
    const featurePackages = subscription?.plan?.featurePackages || [];

    // Flatten all features from all assigned packages
    const allFeatures = featurePackages.reduce(
      (acc: string[], pkg: any) => [...acc, ...(pkg.features || [])],
      [],
    );

    return allFeatures.includes(feature);
  };

  return { hasFeature };
}

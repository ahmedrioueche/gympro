import { UserRole } from "@ahmedrioueche/gympro-client";
import { useCallback } from "react";
import { useUserStore } from "../store/user";
import { useCoachAffiliations } from "./queries/useGymCoach";

/**
 * Hook to manage and verify user access to specific gyms.
 */
export function useGymAccess() {
  const { user } = useUserStore();
  const { data: coachAffiliations = [] } = useCoachAffiliations();

  const isAdmin = user?.role === UserRole.Admin;

  /**
   * Checks if the current user has access to a gym.
   * Admins have global access. Other users must have an active membership or coach affiliation.
   */
  const hasAccess = useCallback(
    (gymId?: string) => {
      if (!user || !gymId) return false;

      // Admin bypass
      if (isAdmin) return true;

      // Check memberships (Only Active)
      const hasActiveMembership =
        user.memberships?.some((m) => {
          if (typeof m === "string") return false;
          const mGymId =
            typeof m.gym === "string" ? m.gym : m.gym?._id || (m as any).gymId;
          return (
            String(mGymId) === String(gymId) && m.membershipStatus === "active"
          );
        }) ?? false;

      if (hasActiveMembership) return true;

      // Check Coach Affiliations (Only Active)
      const hasActiveAffiliation = coachAffiliations.some((a) => {
        const aGymId =
          a.gymId || (typeof a.gym === "object" ? a.gym?._id : a.gym);
        return String(aGymId) === String(gymId) && a.status === "active";
      });

      return hasActiveAffiliation;
    },
    [user, isAdmin, coachAffiliations],
  );

  /**
   * Checks if the user has a pending request for a gym.
   */
  const isPending = useCallback(
    (gymId?: string) => {
      if (!user || !gymId) return false;
      const targetId = String(gymId);

      // Check memberships (Only Pending)
      const isPendingMembership =
        user.memberships?.some((m) => {
          if (typeof m === "string") return false;
          const mGymId =
            typeof m.gym === "string" ? m.gym : m.gym?._id || (m as any).gymId;
          return (
            String(mGymId) === targetId && m.membershipStatus === "pending"
          );
        }) ?? false;

      if (isPendingMembership) return true;

      // Check Coach Affiliations (Only Pending)
      const isPendingAffiliation = coachAffiliations.some((a) => {
        const aGymId =
          a.gymId || (typeof a.gym === "object" ? a.gym?._id : a.gym);
        return String(aGymId) === targetId && a.status === "pending";
      });

      return isPendingAffiliation;
    },
    [user, coachAffiliations],
  );

  return {
    hasAccess,
    isPending,
    isAdmin,
    user,
  };
}

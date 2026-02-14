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
    (gymIdOrGym?: string | any) => {
      const gymId =
        typeof gymIdOrGym === "string" ? gymIdOrGym : gymIdOrGym?._id;
      if (!user || !gymId) return false;

      // Admin/AppEditor global bypass
      if (isAdmin || user.role === UserRole.AppEditor) return true;

      // Owner/Manager bypass for gyms they own/manage (based on gym object if provided)
      if (typeof gymIdOrGym === "object" && gymIdOrGym.owner) {
        const ownerId =
          typeof gymIdOrGym.owner === "object"
            ? gymIdOrGym.owner?._id
            : gymIdOrGym.owner;
        if (String(ownerId) === String(user._id)) {
          if (user.role === UserRole.Owner || user.role === UserRole.Manager)
            return true;
        }
      }

      // Check memberships
      const hasActiveMembership =
        user.memberships?.some((m) => {
          const mGymId =
            typeof m === "string"
              ? m
              : typeof m.gym === "string"
                ? m.gym
                : m.gym?._id || (m as any).gymId;
          const isMatch = String(mGymId) === String(gymId);
          if (!isMatch) return false;

          // If it's a string, we don't know the status, but if they are Owner/Manager globally,
          // and they have a membership record for this gym, we should probably let them in.
          if (typeof m === "string") {
            return (
              user.role === UserRole.Owner || user.role === UserRole.Manager
            );
          }

          // Owners and Managers have access to their gyms regardless of status
          if (user.role === UserRole.Owner || user.role === UserRole.Manager) {
            return true;
          }

          return m.membershipStatus === "active";
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

import { UserRole, type Gym } from "@ahmedrioueche/gympro-client";
import { useMemo } from "react";
import { useCoachAffiliations } from "../../../../hooks/queries/useGymCoach";
import { useUserStore } from "../../../../store/user";

/**
 * Hook to filter gyms based on active dashboard role.
 *
 * Each dashboard shows only gyms where the user has a matching role:
 * - Coach dashboard → gyms where membership.roles includes 'coach'
 * - Member dashboard → gyms where membership.roles includes 'member'
 * - Manager dashboard → gyms where membership.roles includes 'owner', 'manager', or 'staff'
 */
export function useGymFilter(gyms: Gym[]) {
  const { user, activeDashboard } = useUserStore();
  const { data: affiliations = [] } = useCoachAffiliations();

  return useMemo(() => {
    if (!gyms || gyms.length === 0) return [];

    // Active coach affiliated gym IDs
    const activeAffiliatedGymIds = (affiliations as any[])
      .filter((a) => a.status === "active")
      .map((a) => (typeof a.gymId === "object" ? a.gymId?._id : a.gymId));

    // Admin/AppEditor bypass - see all gyms
    if (user?.role === UserRole.Admin || user?.role === UserRole.AppEditor) {
      return gyms;
    }

    // Map dashboard type to allowed membership roles
    const roleMapping: Record<string, string[]> = {
      coach: ["coach"],
      member: ["member"],
      manager: ["owner", "manager", "staff"],
    };
    const allowedRoles = roleMapping[activeDashboard] || ["member"];

    return gyms.filter((gym) => {
      // 1. Check direct ownership if on manager dashboard
      if (
        activeDashboard === "manager" &&
        (user?.role === UserRole.Owner || user?.role === UserRole.Manager)
      ) {
        const ownerId =
          typeof gym.owner === "object" ? gym.owner?._id : gym.owner;
        if (String(ownerId) === String(user?._id)) return true;
      }

      // 2. Check memberships (even if they are just strings/IDs)
      if (user?.memberships) {
        const hasMembershipMatch = user.memberships.some((m) => {
          const mGymId =
            typeof m === "string"
              ? m
              : typeof m.gym === "string"
                ? m.gym
                : m.gym?._id || (m as any).gymId;
          const isMatch = String(mGymId) === String(gym._id);
          if (!isMatch) return false;

          // If membership is just a string, and we are on manager dashboard as owner/manager, allow it
          if (typeof m === "string") {
            return (
              activeDashboard === "manager" &&
              (user.role === UserRole.Owner || user.role === UserRole.Manager)
            );
          }

          return m.roles?.some((r) => allowedRoles.includes(r));
        });

        if (hasMembershipMatch) return true;
      }

      // 3. Check coach affiliations (if on coach dashboard)
      if (activeDashboard === "coach") {
        return activeAffiliatedGymIds.includes(String(gym._id));
      }

      return false;
    });
  }, [gyms, user, activeDashboard, affiliations]);
}

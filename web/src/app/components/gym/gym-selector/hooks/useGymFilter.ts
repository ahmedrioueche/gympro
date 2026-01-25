import type { Gym } from "@ahmedrioueche/gympro-client";
import { useMemo } from "react";
import { useUserStore } from "../../../../../store/user";

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

  return useMemo(() => {
    if (!gyms || gyms.length === 0 || !user?.memberships) return [];

    // Map dashboard type to allowed membership roles
    const roleMapping: Record<string, string[]> = {
      coach: ["coach"],
      member: ["member"],
      manager: ["owner", "manager", "staff"],
    };
    const allowedRoles = roleMapping[activeDashboard] || ["member"];

    // Get gym IDs where user has a membership with matching role
    const matchingGymIds = user.memberships
      .filter((m) => {
        if (typeof m === "string") return false;
        return m.roles?.some((r) => allowedRoles.includes(r));
      })
      .map((m) => {
        if (typeof m === "string") return m;
        return typeof m.gym === "object" ? m.gym._id : m.gym;
      });

    return gyms.filter((g) => matchingGymIds.includes(g._id));
  }, [gyms, user, activeDashboard]);
}

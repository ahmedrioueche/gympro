import type { Gym } from "@ahmedrioueche/gympro-client";
import { useMemo } from "react";

/**
 * Hook to filter gyms (currently returns all gyms)
 *
 * Note: We show ALL gyms regardless of account dashboard.
 * The routing logic (getGymDashboardRoute) determines which
 * gym dashboard (member/manager/coach) to show for each gym
 * based on the user's role in that specific gym.
 */
export function useGymFilter(gyms: Gym[]) {
  return useMemo(() => {
    if (!gyms || gyms.length === 0) return [];
    // Show all gyms - routing will decide which dashboard for each
    return gyms;
  }, [gyms]);
}

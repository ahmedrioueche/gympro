import type { Gym } from "@ahmedrioueche/gympro-client";
import { useUserStore } from "../../../../../store/user";

/**
 * Hook to get user's role in a specific gym
 * Looks up the user's membership for the gym to determine their role
 */
export function useGymRole(gym?: Gym): string | undefined {
  const { user } = useUserStore();

  if (!gym || !user) return undefined;

  // Check if user is the owner
  const ownerId =
    typeof gym.owner === "object" ? gym.owner._id : gym.owner;
  if (ownerId === user._id) {
    return "owner";
  }

  // Find user's membership for this gym
  const membership = user.memberships?.find((m) => {
    if (typeof m === "string") return false;
    const gymId = typeof m.gym === "object" ? m.gym._id : m.gym;
    return gymId === gym._id;
  });

  if (!membership || typeof membership === "string") {
    return undefined;
  }

  // Return first role from membership
  return membership.roles?.[0];
}

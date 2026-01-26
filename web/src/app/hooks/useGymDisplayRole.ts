import { UserRole, type Gym } from "@ahmedrioueche/gympro-client";
import { useUserStore } from "../../store/user";

/**
 * Hook to determine the display role for a gym based on the active dashboard.
 *
 * - Member Dashboard -> "Member" (if has role)
 * - Coach Dashboard -> "Coach" (if has role)
 * - Manager Dashboard -> "Owner" | "Manager" | "Staff" (highest privilege)
 */
export function useGymDisplayRole(gym: Gym | undefined): string | undefined {
  const { user, activeDashboard } = useUserStore();

  if (!user || !user.memberships || !gym) return undefined;

  // Find membership for this gym
  const membership = user.memberships.find((m) => {
    if (typeof m === "string") return false;
    const gId = typeof m.gym === "string" ? m.gym : m.gym._id;
    return gId === gym._id;
  });

  if (!membership || typeof membership === "string") return undefined;

  const roles = membership.roles || [];

  if (activeDashboard === "member" && roles.includes(UserRole.Member)) {
    return "Member";
  }

  if (activeDashboard === "coach" && roles.includes(UserRole.Coach)) {
    return "Coach";
  }

  if (activeDashboard === "manager") {
    if (roles.includes(UserRole.Owner)) return "Owner";
    if (roles.includes(UserRole.Manager)) return "Manager";
    if (roles.includes(UserRole.Receptionist)) return "Staff";
  }

  return undefined;
}

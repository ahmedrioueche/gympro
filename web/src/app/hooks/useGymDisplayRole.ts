import { UserRole, type Gym } from "@ahmedrioueche/gympro-client";
import { useCoachAffiliations } from "../../hooks/queries/useGymCoach";
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
  const { data: coachAffiliations = [] } = useCoachAffiliations();

  if (!user || !gym) return undefined;

  // 1. Check direct ownership if on manager dashboard
  if (
    activeDashboard === "manager" &&
    (user.role === UserRole.Owner || user.role === UserRole.Manager)
  ) {
    const ownerId = typeof gym.owner === "object" ? gym.owner?._id : gym.owner;
    if (String(ownerId) === String(user._id)) return "Owner";
  }

  // 2. Check coach affiliations if on coach dashboard
  if (activeDashboard === "coach") {
    const isAffiliatedCoach = coachAffiliations.some(
      (a) =>
        (String(a.gymId) === String(gym._id) ||
          String(a.gym?._id) === String(gym._id)) &&
        a.status === "active",
    );
    if (isAffiliatedCoach) return "Coach";
  }

  // 3. Check memberships (even if they are just strings/IDs)
  if (!user.memberships) return undefined;

  const membership = user.memberships.find((m) => {
    const mGymId =
      typeof m === "string"
        ? m
        : typeof m.gym === "string"
          ? m.gym
          : m.gym?._id || (m as any).gymId;
    return String(mGymId) === String(gym._id);
  });

  if (!membership) return undefined;

  // If membership is just a string, and we are on manager dashboard as owner/manager, allow identifying as Owner/Manager
  if (typeof membership === "string") {
    if (activeDashboard === "manager") {
      return user.role === UserRole.Owner ? "Owner" : "Manager";
    }
    return undefined;
  }

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

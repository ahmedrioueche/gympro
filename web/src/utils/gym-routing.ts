import type { DashboardType, Gym, User } from "@ahmedrioueche/gympro-client";
import { APP_PAGES } from "../constants/navigation";
import { ALL_STAFF_ROLES } from "../constants/roles";

/**
 * Determines the correct gym dashboard route based on the active dashboard.
 *
 * The gym selector already filters gyms by role, so this just maps
 * the active dashboard to the corresponding route.
 */
export function getGymRouteForDashboard(
  activeDashboard: DashboardType,
): string {
  switch (activeDashboard) {
    case "manager":
      return APP_PAGES.gym.manager.home.link;
    case "coach":
      return APP_PAGES.gym.coach.home.link;
    case "member":
    default:
      return APP_PAGES.gym.member.home.link;
  }
}

/**
 * Checks if user has staff role in the specified gym
 */
export function isStaffInGym(user: User | null, gym: Gym): boolean {
  if (!user) return false;

  const ownerId = typeof gym.owner === "object" ? gym.owner?._id : gym.owner;
  if (ownerId === user._id) return true;

  const membership = user.memberships?.find((m) => {
    const membershipGymId = typeof m.gym === "object" ? m.gym._id : m.gym;
    return membershipGymId === gym._id;
  });
  if (!membership || typeof membership === "string") return false;

  const membershipRoles = (membership.roles || []) as string[];
  return membershipRoles.some((role) =>
    ALL_STAFF_ROLES.map(String).includes(role),
  );
}

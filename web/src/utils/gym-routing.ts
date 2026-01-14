import type { Gym, User } from "@ahmedrioueche/gympro-client";
import { APP_PAGES } from "../constants/navigation";
import {
  ALL_STAFF_ROLES,
  COACH_DASHBOARD_ROLES,
  MANAGER_DASHBOARD_ROLES,
} from "../constants/roles";

/**
 * Determines the correct gym dashboard route based on user's membership roles
 * in the specified gym.
 *
 * Priority:
 * 1. Check if user is gym owner
 * 2. Check membership roles
 * 3. Default to member dashboard
 */
export function getGymDashboardRoute(user: User | null, gym: Gym): string {
  if (!user) {
    return APP_PAGES.gym.member.home.link;
  }

  // Check if user is the gym owner
  const ownerId = typeof gym.owner === "object" ? gym.owner?._id : gym.owner;
  if (ownerId === user._id) {
    return APP_PAGES.gym.manager.home.link;
  }

  // Find user's membership in this gym
  // Handle both populated (object) and unpopulated (string) gym references
  const membership = user.memberships?.find((m) => {
    const membershipGymId = typeof m.gym === "object" ? m.gym._id : m.gym;
    return membershipGymId === gym._id;
  });

  if (!membership || typeof membership === "string") {
    return APP_PAGES.gym.member.home.link;
  }

  const membershipRoles = (membership.roles || []) as string[];

  // Check for manager dashboard roles
  if (
    membershipRoles.some((role) =>
      MANAGER_DASHBOARD_ROLES.map(String).includes(role)
    )
  ) {
    return APP_PAGES.gym.manager.home.link;
  }

  // Check for coach dashboard roles
  if (
    membershipRoles.some((role) =>
      COACH_DASHBOARD_ROLES.map(String).includes(role)
    )
  ) {
    // TODO: Add coach dashboard route when implemented
    return APP_PAGES.gym.member.home.link; // Fallback for now
  }

  // Default to member dashboard
  return APP_PAGES.gym.member.home.link;
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
    ALL_STAFF_ROLES.map(String).includes(role)
  );
}

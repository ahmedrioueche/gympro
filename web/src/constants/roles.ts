import { UserRole } from "@ahmedrioueche/gympro-client";

/**
 * Staff roles that access the manager dashboard in a gym
 */
export const MANAGER_DASHBOARD_ROLES = [
  UserRole.Owner,
  UserRole.Manager,
  UserRole.Receptionist,
  UserRole.Cleaner,
  UserRole.Maintenance,
] as const;

/**
 * Roles that access the coach dashboard in a gym
 */
export const COACH_DASHBOARD_ROLES = [UserRole.Coach] as const;

/**
 * All staff roles (for any staff-related checks)
 */
export const ALL_STAFF_ROLES = [
  ...MANAGER_DASHBOARD_ROLES,
  ...COACH_DASHBOARD_ROLES,
] as const;

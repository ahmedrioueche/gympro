export const APP_PERMISSIONS = {
  MANAGE_USERS: "manage_users",
  MANAGE_GYMS: "manage_gyms",
  MANAGE_REVENUE: "manage_revenue",
  MANAGE_EDITORS: "manage_editors",
  MANAGE_PLANS: "manage_plans",
  MANAGE_COACH_REQUESTS: "manage_coach_requests",
  MANAGE_REPORTS: "manage_reports",
  MANAGE_ALERTS: "manage_alerts",
  MANAGE_NOTIFICATIONS: "manage_notifications",
} as const;

export type AppPermission =
  (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS];

export const ALL_APP_PERMISSIONS = Object.values(
  APP_PERMISSIONS,
) as AppPermission[];

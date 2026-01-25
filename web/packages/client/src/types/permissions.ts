/**
 * Gym Staff Permissions System
 *
 * Granular permissions that can be assigned to staff members.
 * Owners always have all permissions. Managers can assign permissions to staff.
 */

// All available permissions in the system
export const GYM_PERMISSIONS = {
  // Member management
  members: {
    view: "members:view",
    create: "members:create",
    edit: "members:edit",
    delete: "members:delete",
  },
  // Attendance
  attendance: {
    view: "attendance:view",
    checkin: "attendance:checkin",
    manage: "attendance:manage",
  },
  // Pricing & subscriptions
  pricing: {
    view: "pricing:view",
    manage: "pricing:manage",
  },
  // Staff management
  staff: {
    view: "staff:view",
    manage: "staff:manage",
  },
  // Gym settings
  settings: {
    view: "settings:view",
    manage: "settings:manage",
  },
  // Analytics & reports
  analytics: {
    view: "analytics:view",
    export: "analytics:export",
  },
  // Schedules & classes
  schedules: {
    view: "schedules:view",
    manage: "schedules:manage",
  },
  // Clients (Coach specific)
  clients: {
    view: "clients:view",
    manage: "clients:manage",
  },
  // Payments (Coach specific commissions/payouts)
  payments: {
    view: "payments:view",
    manage: "payments:manage",
  },
} as const;

// Extract all permission values as a union type
type PermissionValues<T> = T extends Record<string, infer U>
  ? U extends Record<string, string>
    ? U[keyof U]
    : U
  : never;

export type GymPermission = PermissionValues<typeof GYM_PERMISSIONS>;

// Flat array of all permissions for iteration
export const ALL_GYM_PERMISSIONS: GymPermission[] = Object.values(
  GYM_PERMISSIONS
).reduce((acc, group) => {
  return [...acc, ...Object.values(group)];
}, [] as any[]) as GymPermission[];

// Permission groups for UI display
export interface PermissionGroupInfo {
  key: string;
  label: string;
  description: string;
  permissions: {
    key: GymPermission;
    label: string;
    description: string;
  }[];
}

export const PERMISSION_GROUPS: PermissionGroupInfo[] = [
  {
    key: "members",
    label: "Members",
    description: "Manage gym members and their information",
    permissions: [
      {
        key: "members:view",
        label: "View Members",
        description: "View member list and profiles",
      },
      {
        key: "members:create",
        label: "Add Members",
        description: "Add new members to the gym",
      },
      {
        key: "members:edit",
        label: "Edit Members",
        description: "Edit member information",
      },
      {
        key: "members:delete",
        label: "Remove Members",
        description: "Remove members from the gym",
      },
    ],
  },
  {
    key: "attendance",
    label: "Attendance",
    description: "Track and manage member attendance",
    permissions: [
      {
        key: "attendance:view",
        label: "View Attendance",
        description: "View attendance records",
      },
      {
        key: "attendance:checkin",
        label: "Check-in Members",
        description: "Check members in/out",
      },
      {
        key: "attendance:manage",
        label: "Manage Attendance",
        description: "Edit attendance records",
      },
    ],
  },
  {
    key: "pricing",
    label: "Pricing",
    description: "Manage subscription types and pricing",
    permissions: [
      {
        key: "pricing:view",
        label: "View Pricing",
        description: "View subscription types",
      },
      {
        key: "pricing:manage",
        label: "Manage Pricing",
        description: "Create and edit pricing",
      },
    ],
  },
  {
    key: "staff",
    label: "Staff",
    description: "Manage gym staff members",
    permissions: [
      {
        key: "staff:view",
        label: "View Staff",
        description: "View staff list",
      },
      {
        key: "staff:manage",
        label: "Manage Staff",
        description: "Add, edit, remove staff",
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    description: "Gym settings and configuration",
    permissions: [
      {
        key: "settings:view",
        label: "View Settings",
        description: "View gym settings",
      },
      {
        key: "settings:manage",
        label: "Manage Settings",
        description: "Change gym settings",
      },
    ],
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "View reports and analytics",
    permissions: [
      {
        key: "analytics:view",
        label: "View Analytics",
        description: "View reports and charts",
      },
      {
        key: "analytics:export",
        label: "Export Data",
        description: "Export reports and data",
      },
    ],
  },
  {
    key: "schedules",
    label: "Schedules",
    description: "Manage classes and schedules",
    permissions: [
      {
        key: "schedules:view",
        label: "View Schedules",
        description: "View class schedules",
      },
      {
        key: "schedules:manage",
        label: "Manage Schedules",
        description: "Create and edit schedules",
      },
    ],
  },
  {
    key: "clients",
    label: "Clients",
    description: "Manage assigned clients",
    permissions: [
      {
        key: "clients:view",
        label: "View Clients",
        description: "View assigned clients",
      },
      {
        key: "clients:manage",
        label: "Manage Clients",
        description: "Manage client assignments",
      },
    ],
  },
  {
    key: "payments",
    label: "Payments",
    description: "View payments and earnings",
    permissions: [
      {
        key: "payments:view",
        label: "View Payments",
        description: "View earnings and payouts",
      },
      {
        key: "payments:manage",
        label: "Manage Payments",
        description: "Manage payment settings",
      },
    ],
  },
];

// Default permissions by role
export const DEFAULT_ROLE_PERMISSIONS: Record<string, GymPermission[]> = {
  owner: ALL_GYM_PERMISSIONS,
  manager: [
    "members:view",
    "members:create",
    "members:edit",
    "members:delete",
    "attendance:view",
    "attendance:checkin",
    "attendance:manage",
    "pricing:view",
    "pricing:manage",
    "staff:view",
    "staff:manage",
    "settings:view",
    "settings:manage",
    "analytics:view",
    "analytics:export",
    "schedules:view",
    "schedules:manage",
  ],
  receptionist: [
    "members:view",
    "members:create",
    "members:edit",
    "attendance:view",
    "attendance:checkin",
    "attendance:manage",
    "pricing:view",
    "schedules:view",
  ],
  coach: [
    "attendance:view",
    "attendance:checkin",
    "schedules:view",
    "schedules:manage",
    "clients:view",
    "clients:manage",
    "payments:view",
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userPermissions: GymPermission[] | undefined,
  permission: GymPermission
): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: GymPermission[] | undefined,
  permissions: GymPermission[]
): boolean {
  if (!userPermissions) return false;
  return permissions.some((p) => userPermissions.includes(p));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  userPermissions: GymPermission[] | undefined,
  permissions: GymPermission[]
): boolean {
  if (!userPermissions) return false;
  return permissions.every((p) => userPermissions.includes(p));
}

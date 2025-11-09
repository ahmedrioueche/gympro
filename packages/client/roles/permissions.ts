import { UserRole } from "@client/types";
import { RolePermissions } from "@client/types/role";

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  owner: {
    canManageMembers: true,
    canManageSubscriptions: true,
    canManageStaff: true,
    canViewFinancials: true,
    canAssignPrograms: true,
    canManageAppSubscriptions: true,
    canCustomizePermissions: true,
  },
  manager: {
    canManageMembers: true,
    canManageSubscriptions: true,
    canManageStaff: true,
    canAssignPrograms: true,
    canManageAppSubscriptions: true,
    canCustomizePermissions: true,
  },
  staff: {},
  coach: {
    canAssignPrograms: true,
  },
  member: {},
};

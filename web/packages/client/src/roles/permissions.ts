import { RolePermissions } from '../types/role';
import { UserRole } from '../types/user';

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

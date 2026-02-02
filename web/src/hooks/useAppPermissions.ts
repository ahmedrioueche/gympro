import {
  APP_PERMISSIONS,
  UserRole,
  type AppPermission,
} from "@ahmedrioueche/gympro-client";
import { useCallback, useMemo } from "react";
import { useUserStore } from "../store/user";

/**
 * Hook for checking platform-level permissions (Admin/AppEditor)
 */
export function useAppPermissions() {
  const { user } = useUserStore();

  const isPlatformAdmin = useMemo(() => {
    return user?.role === UserRole.Admin;
  }, [user]);

  const isAppEditor = useMemo(() => {
    return user?.role === UserRole.AppEditor;
  }, [user]);

  /**
   * Check if user has a specific platform permission
   */
  const hasAppPermission = useCallback(
    (permission: AppPermission): boolean => {
      if (isPlatformAdmin) return true;
      if (!isAppEditor || !user) return false;

      const perms = (user as any).appPermissions || [];
      return perms.includes(permission);
    },
    [user, isPlatformAdmin, isAppEditor],
  );

  /**
   * Check if user has ANY of the provided platform permissions
   */
  const hasAnyAppPermission = useCallback(
    (permissions: AppPermission[]): boolean => {
      if (isPlatformAdmin) return true;
      if (!isAppEditor || !user) return false;

      const userPerms = (user as any).appPermissions || [];
      return permissions.some((p) => userPerms.includes(p));
    },
    [user, isPlatformAdmin, isAppEditor],
  );

  return {
    isPlatformAdmin,
    isAppEditor,
    hasAppPermission,
    hasAnyAppPermission,
    APP_PERMISSIONS,
  };
}

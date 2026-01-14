import type { GymPermission } from "@ahmedrioueche/gympro-client";
import { type ReactNode } from "react";
import { usePermissions } from "../../hooks/usePermissions";

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions?: GymPermission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Guard component that renders children only if the user has the required permissions.
 * If no permissions are provided, children are rendered (can be used just to wrap for consistent API).
 */
export default function PermissionGuard({
  children,
  requiredPermissions = [],
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();

  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

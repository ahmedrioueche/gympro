import {
  GYM_PERMISSIONS,
  type GymPermission,
} from "@ahmedrioueche/gympro-client";
import { useCallback, useMemo } from "react";
import { useGymStore } from "../store/gym";
import { useUserStore } from "../store/user";

export function usePermissions() {
  const { user } = useUserStore();
  const { currentGym } = useGymStore();

  /**
   * Get the user's effective permissions for the current gym
   */
  const permissions = useMemo<GymPermission[]>(() => {
    if (!user || !currentGym) return [];

    // Check if user is the owner (handle both populated and unpopulated owner)
    const ownerId =
      typeof currentGym.owner === "object"
        ? currentGym.owner._id
        : currentGym.owner;
    if (ownerId === user._id) {
      // Owner always has all permissions
      // Returning empty array, isOwner flag handles the check
      return [];
    }

    // Find the membership for this gym
    // Handle both populated (object) and unpopulated (string) gym references
    const membership = user.memberships.find((m) => {
      if (typeof m === "string") return false;
      const gymId = typeof m.gym === "object" ? m.gym._id : m.gym;
      return gymId === currentGym._id;
    });

    if (!membership || typeof membership === "string") return [];

    // Use the granular permissions if they exist
    if (membership.permissions && membership.permissions.length > 0) {
      return membership.permissions as GymPermission[];
    }

    // Fallback? Currently we don't have role-based fallbacks in frontend logic
    // We rely on what's saved in the membership
    return [];
  }, [user, currentGym]);

  /**
   * Check if user is the owner of the current gym
   */
  const isOwner = useMemo(() => {
    if (!user || !currentGym) return false;

    // Handle both populated (object) and unpopulated (string) owner references
    const ownerId =
      typeof currentGym.owner === "object"
        ? currentGym.owner._id
        : currentGym.owner;

    return ownerId === user._id;
  }, [user, currentGym]);

  /**
   * Check if current user has a specific permission
   */
  const hasPermission = useCallback(
    (permission: GymPermission): boolean => {
      // Owner has everything
      if (isOwner) return true;

      return permissions.includes(permission);
    },
    [permissions, isOwner]
  );

  /**
   * Check if user has ANY of the provided permissions
   */
  const hasAnyPermission = useCallback(
    (requiredPermissions: GymPermission[]): boolean => {
      if (isOwner) return true;
      if (requiredPermissions.length === 0) return true;

      return requiredPermissions.some((p) => permissions.includes(p));
    },
    [permissions, isOwner]
  );

  /**
   * Check if user has ALL of the provided permissions
   */
  const hasAllPermissions = useCallback(
    (requiredPermissions: GymPermission[]): boolean => {
      if (isOwner) return true;
      if (requiredPermissions.length === 0) return true;

      return requiredPermissions.every((p) => permissions.includes(p));
    },
    [permissions, isOwner]
  );

  return {
    permissions,
    isOwner,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    GYM_PERMISSIONS,
  };
}

import { UserRole } from "@ahmedrioueche/gympro-client";
import { Navigate, useLocation } from "@tanstack/react-router";
import React from "react";
import { APP_PAGES } from "../../constants/navigation";
import { useGymStore } from "../../store/gym";
import { useUserStore } from "../../store/user";
import LoadingPage from "../ui/LoadingPage";

interface GymRoleGuardProps {
  children: React.ReactNode;
  /** Roles allowed to access the protected route */
  allowedRoles: UserRole[];
}

/**
 * Guard that protects gym-specific routes based on the user's role
 * within the currently selected gym's membership.
 *
 * This ensures managers can't access member routes and vice versa.
 */
export const GymRoleGuard: React.FC<GymRoleGuardProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useUserStore();
  const { currentGym } = useGymStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  // If no gym is selected, redirect to user's role-based home
  if (!currentGym) {
    const homeLink =
      user.role === "manager" || user.role === "owner"
        ? APP_PAGES.manager.link
        : APP_PAGES.member.link;
    return <Navigate to={homeLink} />;
  }

  // Find the user's membership for the current gym
  const membership = user.memberships?.find(
    (m) => m.gym._id === currentGym._id
  );

  // Check if user is the gym owner
  const ownerId =
    typeof currentGym.owner === "object"
      ? (currentGym.owner as any)?._id
      : currentGym.owner;
  const isGymOwner = ownerId === user._id;

  // Determine the user's roles in this gym
  // Priority: gym ownership > membership roles > fallback to global user role
  let effectiveRoles: UserRole[] = [];

  if (isGymOwner) {
    // Gym owners always have owner role access
    effectiveRoles = [UserRole.Owner];
  } else if (membership?.roles && membership.roles.length > 0) {
    effectiveRoles = membership.roles;
  } else {
    // Fallback to user's global role if no membership roles
    effectiveRoles = [user.role as UserRole];
  }

  // Check if the user has any of the allowed roles
  const hasAccess = effectiveRoles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    // Determine where to redirect based on what roles the user has
    const isManagerInGym = effectiveRoles.some((role) =>
      [UserRole.Owner, UserRole.Manager].includes(role)
    );

    if (isManagerInGym) {
      // User is a manager but trying to access member routes
      if (!location.pathname.startsWith(APP_PAGES.gym.manager.home.link)) {
        return <Navigate to={APP_PAGES.gym.manager.home.link} />;
      }
    } else {
      // User is a member but trying to access manager routes
      if (!location.pathname.startsWith(APP_PAGES.gym.member.home.link)) {
        return <Navigate to={APP_PAGES.gym.member.home.link} />;
      }
    }
  }

  return <>{children}</>;
};

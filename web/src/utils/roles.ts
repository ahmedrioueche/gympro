import { UserRole } from "@ahmedrioueche/gympro-client";
import { APP_PAGES } from "../constants/navigation";

/**
 * Get the default home page for a user based on their role
 */
export const getRoleHomePage = (role: UserRole): string => {
  switch (role) {
    case UserRole.Owner:
    case UserRole.Manager:
      return APP_PAGES.manager.link;

    case UserRole.Coach:
      return APP_PAGES.coach.link;

    case UserRole.Member:
      return APP_PAGES.member.link;

    case UserRole.Staff:
      return APP_PAGES.staff.link;

    default:
      return APP_PAGES.member.link;
  }
};

/**
 * Get the redirect URL after login/signup based on user state
 */
export const getRedirectUrl = (user: {
  role: UserRole;
  isOnBoarded?: boolean;
}): string => {
  // If user hasn't completed onboarding, send them there first
  if (!user.isOnBoarded) {
    return APP_PAGES.onBoarding.link;
  }

  // Otherwise, send to role-specific home page
  return getRoleHomePage(user.role);
};

/**
 * Check if a user has access to a specific route based on their role
 */
export const hasRouteAccess = (role: UserRole, route: string): boolean => {
  const roleRoutePatterns = {
    [UserRole.Owner]: [
      "/manager",
      "/dashboard",
      "/profile",
      "/settings",
      "/notifications",
    ],
    [UserRole.Manager]: [
      "/manager",
      "/dashboard",
      "/profile",
      "/settings",
      "/notifications",
    ],
    [UserRole.Coach]: [
      "/coach",
      "/dashboard",
      "/profile",
      "/settings",
      "/notifications",
    ],
    [UserRole.Member]: [
      "/member",
      "/dashboard",
      "/profile",
      "/settings",
      "/notifications",
    ],
    [UserRole.Staff]: [
      "/staff",
      "/dashboard",
      "/profile",
      "/settings",
      "/notifications",
    ],
  };

  const allowedPatterns = roleRoutePatterns[role] || [];
  return allowedPatterns.some((pattern) => route.startsWith(pattern));
};

/**
 * Redirect user to appropriate page based on their role and current location
 */
export const handleRoleBasedRedirect = (user: {
  role: UserRole;
  isOnBoarded?: boolean;
}): void => {
  const redirectUrl = getRedirectUrl(user);
  window.location.href = redirectUrl;
};

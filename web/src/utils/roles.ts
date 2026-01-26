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

    default:
      return APP_PAGES.member.link;
  }
};

export const getRoleBasedPage = (userRole: string, page: string): string => {
  // Normalize the role (in case it comes in different formats)
  let normalizedRole = userRole.toLowerCase().trim();
  if (normalizedRole === "owner") normalizedRole = "manager";

  // Check if the role exists in APP_PAGES
  if (!(normalizedRole in APP_PAGES)) {
    console.warn(`Role "${userRole}" not found in APP_PAGES`);
    // Fallback to shared pages
    const sharedPage = (APP_PAGES as any)[page];
    return sharedPage?.link || "/";
  }

  const rolePages = (APP_PAGES as any)[normalizedRole];

  // Check if rolePages is valid and has the requested page
  if (rolePages && typeof rolePages === "object") {
    const targetPage = rolePages[page];
    if (targetPage && typeof targetPage === "object" && "link" in targetPage) {
      return targetPage.link;
    }
  }

  // Fallback to shared pages
  const sharedPage = (APP_PAGES as any)[page];
  return sharedPage?.link || "/";
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
      "/member",
      "/dashboard",
      "/profile",
      "/settings",
      "/notifications",
      "/payment",
      "/gym",
    ],
    [UserRole.Manager]: [
      "/manager",
      "/member",
      "/dashboard",
      "/profile",
      "/settings",
      "/notifications",
      "/gym",
    ],
    [UserRole.Coach]: [
      "/coach",
      "/member",
      "/dashboard",
      "/profile",
      "/settings",
      "/notifications",
      "/gym",
    ],
    [UserRole.Member]: [
      "/member",
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

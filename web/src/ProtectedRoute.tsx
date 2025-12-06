import type { UserRole } from "@ahmedrioueche/gympro-client";
import { useRouter } from "@tanstack/react-router";
import React, { useEffect } from "react";
import LoadingPage from "./components/ui/LoadingPage";
import { useUserStore } from "./store/user";
import { getRoleHomePage, hasRouteAccess } from "./utils/roles";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoading, fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await fetchUser();

      if (!user) return router.navigate({ to: "/auth/login" });
      if (!user.profile.isValidated)
        return router.navigate({ to: "/auth/verify-email" });
      if (!user.profile.isOnBoarded)
        return router.navigate({ to: "/onboarding" });
      // Role-based access: prevent users from accessing routes they're not allowed to
      try {
        const currentPath = window.location.pathname;
        if (user?.role && !hasRouteAccess(user.role as UserRole, currentPath)) {
          const redirectUrl = getRoleHomePage(user.role as UserRole);
          return router.navigate({ to: redirectUrl });
        }
      } catch (err) {
        // If anything goes wrong, allow navigation to continue (fail-open)
        console.warn("Role-based access check failed:", err);
      }
    };

    checkAuth();
  }, [fetchUser, router]);

  if (isLoading) return <LoadingPage />;

  return <>{children}</>;
};

export default ProtectedRoute;

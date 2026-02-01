import { useRouter } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { useUserStore } from "../../store/user";
import LoadingPage from "../ui/LoadingPage";

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isLoading, fetchUser, user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      let currentUser = user;
      if (!currentUser) {
        currentUser = await fetchUser();
      }

      if (!currentUser) {
        return router.navigate({ to: "/auth/login" });
      }

      if (currentUser.role !== "admin" && currentUser.role !== "app_editor") {
        return router.navigate({ to: "/" });
      }
    };

    checkAuth();
  }, [fetchUser, router, user]);

  if (isLoading) return <LoadingPage />;

  // Render children only if authorized (or while checking - handled by useEffect redirect)
  // Better UX might be to show loading until we are sure
  if (!user || (user.role !== "admin" && user.role !== "app_editor")) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

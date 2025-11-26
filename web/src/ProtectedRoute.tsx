import { useRouter } from "@tanstack/react-router";
import React, { useEffect } from "react";
import LoadingPage from "./components/ui/LoadingPage";
import { useUserStore } from "./store/user";

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
    };

    checkAuth();
  }, [fetchUser, router]);

  if (isLoading) return <LoadingPage />;

  return <>{children}</>;
};

export default ProtectedRoute;

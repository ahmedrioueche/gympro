import type { UserRole } from "@ahmedrioueche/gympro-client";
import { Navigate, useNavigate } from "@tanstack/react-router";
import React from "react";
import { useUserStore } from "../store/user";
import { redirectUserToHomePageAfterTimeout } from "../utils/helper";
import LoadingPage from "./ui/LoadingPage";

interface AlreadyOnboardedGuardProps {
  children: React.ReactNode;
}

export const AlreadyOnboardedGuard: React.FC<AlreadyOnboardedGuardProps> = ({
  children,
}) => {
  const { user, isLoading } = useUserStore();
  const navigate = useNavigate();
  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (user.profile.isOnBoarded) {
    console.log("onboarded");
    redirectUserToHomePageAfterTimeout(user.role as UserRole, 0, navigate);
  }

  // Otherwise, allow access to onboarding
  return <>{children}</>;
};

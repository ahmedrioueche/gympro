import { Navigate } from "@tanstack/react-router";
import React from "react";
import { OnboardingPage } from "../app/pages/main/onBoarding/OnBoardingPage";
import { useUserStore } from "../store/user";
import LoadingPage from "./ui/LoadingPage";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({
  children,
}) => {
  const { user, isLoading } = useUserStore();

  if (isLoading) {
    return <LoadingPage />;
  }
  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  const isOnboardingCompleted = user.profile.isOnBoarded;

  // If onboarding is not completed, show onboarding page
  if (!isOnboardingCompleted) {
    return <OnboardingPage />;
  }

  // If onboarding is completed, show the protected content
  return <>{children}</>;
};

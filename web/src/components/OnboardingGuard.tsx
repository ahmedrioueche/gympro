import React from 'react';
import { OnboardingPage } from '../app/pages/main/onboarding/OnboardingPage';
import { useUserStore } from '../store/user';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user } = useUserStore();
  const isOnboardingCompleted = user.profile.isOnBoarded;

  // If onboarding is not completed, show onboarding page
  if (!isOnboardingCompleted) {
    return <OnboardingPage />;
  }

  // If onboarding is completed, show the protected content
  return <>{children}</>;
};

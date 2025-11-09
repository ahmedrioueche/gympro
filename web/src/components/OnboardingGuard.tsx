import React from 'react';
import { OnBoardingPage } from '../app/pages/main/onBoarding/OnBoardingPage';
import { useOnboarding } from '../context/OnboardingContext';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { isOnboardingCompleted } = useOnboarding();

  // If onboarding is not completed, show onboarding page
  if (!isOnboardingCompleted) {
    return <OnBoardingPage />;
  }

  // If onboarding is completed, show the protected content
  return <>{children}</>;
};

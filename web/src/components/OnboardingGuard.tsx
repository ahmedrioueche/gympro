import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { OnBoardingPage } from '../app/main/onBoarding/OnBoardingPage';
import { useOnboarding } from '../context/OnboardingContext';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { isOnboardingCompleted } = useOnboarding();
  const navigate = useNavigate();

  // If onboarding is not completed, show onboarding page
  if (!isOnboardingCompleted) {
    return <OnBoardingPage />;
  }

  // If onboarding is completed, show the protected content
  return <>{children}</>;
};

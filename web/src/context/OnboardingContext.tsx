import React, { createContext, useContext, useEffect, useState } from 'react';

interface OnboardingContextType {
  isOnboardingCompleted: boolean;
  selectedRole: string | null;
  completeOnboarding: (role?: string) => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';
const ONBOARDING_ROLE_KEY = 'onboarding_selected_role';

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored onboarding data on app start
    const checkStoredData = () => {
      try {
        const completed = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
        const role = localStorage.getItem(ONBOARDING_ROLE_KEY);

        setIsOnboardingCompleted(completed === 'true');
        setSelectedRole(role);
      } catch (error) {
        console.error('Error checking stored onboarding data:', error);
      }
    };

    checkStoredData();
  }, []);

  const completeOnboarding = (role?: string) => {
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      if (role) {
        localStorage.setItem(ONBOARDING_ROLE_KEY, role);
        setSelectedRole(role);
      }
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const skipOnboarding = () => {
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  const resetOnboarding = () => {
    try {
      localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      localStorage.removeItem(ONBOARDING_ROLE_KEY);
      setIsOnboardingCompleted(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  const value: OnboardingContextType = {
    isOnboardingCompleted,
    selectedRole,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

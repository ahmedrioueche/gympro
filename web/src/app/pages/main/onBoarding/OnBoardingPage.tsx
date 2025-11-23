import type { UserRole } from '@ahmedrioueche/gympro-client';
import { useNavigate } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../../../../components/ui/Logo';
import { getRoleHomePage } from '../../../../utils/roles';
import { MemberDetailsForm } from './components/MemberDetailsForm';
import { OwnerDetailsForm } from './components/OwnerDetailsForm';
import { RolesFeaturesStep } from './components/RolesFeaturesStep';
import { ONBOARDING_ROLES, ONBOARDING_STEPS } from './constants';

export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const redirectUrl = getRoleHomePage(selectedRole);
      navigate({ to: redirectUrl });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <RolesFeaturesStep
            step={ONBOARDING_STEPS[0]}
            roles={ONBOARDING_ROLES}
            selectedRole={selectedRole}
            setSelectedRole={(role) => {
              setSelectedRole(role);
              handleNext();
            }}
          />
        );
      case 1:
        if (selectedRole === 'owner') {
          return <OwnerDetailsForm onSubmit={() => {}} />;
        } else if (selectedRole === 'coach') {
          return <MemberDetailsForm onSubmit={() => {}} isCoach />;
        } else if (selectedRole === 'member') {
          return <MemberDetailsForm onSubmit={() => {}} />;
        }
        return null;
      default:
        return null;
    }
  };

  const isNextDisabled = currentStep === 0 && !selectedRole;
  const isPreviousDisabled = currentStep === 0;

  return (
    <div className='min-h-screen bg-background flex flex-col relative'>
      {' '}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none'
        style={{
          backgroundImage: 'url(/stories/gym-story-1.svg)',
          zIndex: 0,
        }}
      />
      {/* Content Wrapper with higher z-index */}
      <div className='relative z-10 flex flex-col min-h-screen'>
        {/* Progress Bar */}
        <div className='w-full h-1 bg-surface'>
          <div
            className='h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500'
            style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <header className='flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 sm:py-6 gap-3'>
          <Logo />
          {/* Step Indicators */}
          <div className='flex items-center gap-2 sm:gap-3'>
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                      ? 'w-2 bg-primary/50'
                      : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-y-auto flex flex-col items-center w-full'>
          {renderStep()}
        </main>

        {/* Footer */}
        <footer className='px-4 sm:px-8 py-4 sm:py-6 bg-surface/50 backdrop-blur-sm border-t border-border'>
          <div
            className={`flex flex-col sm:flex-row items-center max-w-5xl mx-auto gap-3 ${
              isPreviousDisabled ? 'sm:justify-end' : 'sm:justify-between'
            }`}
          >
            {!isPreviousDisabled && (
              <button
                onClick={handlePrevious}
                className='w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-surface text-text-primary'
              >
                {t('onboarding.previous')}
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={isNextDisabled}
              className={`w-full sm:w-auto group px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                isNextDisabled
                  ? 'opacity-50 cursor-not-allowed bg-surface text-text-secondary'
                  : 'bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-105'
              }`}
            >
              {currentStep === ONBOARDING_STEPS.length - 1
                ? t('onboarding.finish')
                : t('onboarding.next')}
              <ChevronRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

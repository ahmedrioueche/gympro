import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../../../../components/Hero';
import Button from '../../../../components/ui/Button';
import FeatureCard from '../../../../components/ui/FeatureCard';
import Icon from '../../../../components/ui/Icon';
import PageIndicator from '../../../../components/ui/PageIndicator';
import RoleCard from '../../../../components/ui/RoleCard';
import { useOnboarding } from '../../../../context/OnboardingContext';

export function OnBoardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { completeOnboarding, skipOnboarding } = useOnboarding();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = 4;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: nextPage * containerRef.current.clientWidth,
          behavior: 'smooth',
        });
      }
    } else {
      completeOnboarding(selectedRole || undefined);
      navigate({ to: '/auth/login' });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: prevPage * containerRef.current.clientWidth,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleSkip = () => {
    skipOnboarding();
    navigate({ to: '/auth/login' });
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const renderWelcomeSlide = () => (
    <div className='flex flex-col items-center justify-center h-full px-8 text-center'>
      <div className='mb-12'>
        <div className='w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-8 mx-auto'>
          <Icon name='gym' size={64} />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
          {t('onboarding.welcome.title')}
        </h1>
        <h2 className='text-xl text-primary dark:text-primary-400 mb-6'>
          {t('onboarding.welcome.subtitle')}
        </h2>
        <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl'>
          {t('onboarding.welcome.description')}
        </p>
      </div>
    </div>
  );

  const renderFeaturesSlide = () => (
    <div className='flex flex-col items-center justify-center h-full px-6'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
          {t('onboarding.features.title')}
        </h2>
        <p className='text-lg text-gray-600 dark:text-gray-300'>
          {t('onboarding.features.subtitle')}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full'>
        <FeatureCard
          icon={<Icon name='members' size={48} />}
          title={t('onboarding.features.memberManagement.title')}
          description={t('onboarding.features.memberManagement.description')}
        />
        <FeatureCard
          icon={<Icon name='coach' size={48} />}
          title={t('onboarding.features.coaching.title')}
          description={t('onboarding.features.coaching.description')}
        />
        <FeatureCard
          icon={<Icon name='payment' size={48} />}
          title={t('onboarding.features.payments.title')}
          description={t('onboarding.features.payments.description')}
        />
        <FeatureCard
          icon={<Icon name='analytics' size={48} />}
          title={t('onboarding.features.analytics.title')}
          description={t('onboarding.features.analytics.description')}
        />
      </div>
    </div>
  );

  const renderRolesSlide = () => (
    <div className='flex flex-col items-center justify-center h-full px-6'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
          {t('onboarding.roles.title')}
        </h2>
        <p className='text-lg text-gray-600 dark:text-gray-300'>{t('onboarding.roles.subtitle')}</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full'>
        <RoleCard
          icon={<Icon name='owner' size={32} />}
          title={t('onboarding.roles.owner.title')}
          description={t('onboarding.roles.owner.description')}
          isSelected={selectedRole === 'owner'}
          onClick={() => handleRoleSelect('owner')}
        />
        <RoleCard
          icon={<Icon name='coach' size={32} />}
          title={t('onboarding.roles.coach.title')}
          description={t('onboarding.roles.coach.description')}
          isSelected={selectedRole === 'coach'}
          onClick={() => handleRoleSelect('coach')}
        />
        <RoleCard
          icon={<Icon name='client' size={32} />}
          title={t('onboarding.roles.member.title')}
          description={t('onboarding.roles.member.description')}
          isSelected={selectedRole === 'client'}
          onClick={() => handleRoleSelect('client')}
        />
      </div>
    </div>
  );

  const renderGetStartedSlide = () => (
    <div className='flex flex-col items-center justify-center h-full px-8 text-center'>
      <div className='mb-12'>
        <div className='w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-8 mx-auto'>
          <Icon name='rocket' size={64} />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
          {t('onboarding.getStarted.title')}
        </h1>
        <h2 className='text-xl text-primary dark:text-primary-400 mb-6'>
          {t('onboarding.getStarted.subtitle')}
        </h2>
        <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl'>
          {t('onboarding.getStarted.description')}
        </p>
      </div>
    </div>
  );

  const renderSlide = (index: number) => {
    switch (index) {
      case 0:
        return renderWelcomeSlide();
      case 1:
        return renderFeaturesSlide();
      case 2:
        return renderRolesSlide();
      case 3:
        return renderGetStartedSlide();
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen flex'>
      <Hero />
      <div className='flex-1 flex flex-col bg-background'>
        {/* Header with Skip button */}
        <div className='flex justify-between items-center px-6 py-4'>
          <div className='w-16' />
          <PageIndicator currentPage={currentPage} totalPages={totalPages} />
          <Button variant='ghost' size='sm' onClick={handleSkip} className='px-4'>
            {t('onboarding.skip')}
          </Button>
        </div>

        {/* Content */}
        <div
          ref={containerRef}
          className='flex-1 overflow-hidden'
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className='flex h-full'>
            {Array.from({ length: totalPages }, (_, index) => (
              <div
                key={index}
                className='w-full h-full flex-shrink-0'
                style={{ scrollSnapAlign: 'start' }}
              >
                {renderSlide(index)}
              </div>
            ))}
          </div>
        </div>

        {/* Footer with navigation buttons */}
        <div className='px-6 py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-center max-w-md mx-auto'>
            <Button
              variant='outline'
              size='lg'
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className='flex-1 mr-3'
            >
              {t('onboarding.previous')}
            </Button>
            <Button
              variant='filled'
              size='lg'
              onClick={handleNext}
              disabled={currentPage === 2 && !selectedRole}
              className='flex-1 ml-3'
            >
              {currentPage === totalPages - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

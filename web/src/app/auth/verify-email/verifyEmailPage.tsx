import { useRouter, useSearch } from '@tanstack/react-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Auth } from '../../../api/auth/auth';
import ErrorSection from '../../../components/ui/ErrorSection';
import LoadingPage from '../../../components/ui/LoadingPage';
import { APP_PAGES } from '../../../constants/navigation';

const VERIFY_SUCCESS_REDIRECT_DELAY = 3000;

const VerifyEmailPage: React.FC = () => {
  const search = useSearch({ from: '/auth/verify-email' });
  const router = useRouter();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const isSuccessRef = useRef(false);

  useEffect(() => {
    const token = search.token;
    if (!token) {
      setStatus('error');
      setError(t('auth.verifyEmail.missingToken'));
      return;
    }

    Auth.verifyEmail(token)
      .then((res) => {
        console.log('Verify email response:', res); // Debug log

        if (res && res.success && res.data) {
          isSuccessRef.current = true;
          setStatus('success');
          setSuccessMessage(res.data.message || t('auth.verifyEmail.successMessage'));

          // Store user data for automatic authentication
          if (res.data.user) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
            sessionStorage.setItem('user', JSON.stringify(res.data.user));
          }

          // Redirect based on user onboarding status
          setTimeout(() => {
            // Only redirect if still in success state
            if (isSuccessRef.current) {
              if (res.data.user?.isOnBoarded) {
                // User is already onboarded, redirect to dashboard
                router.navigate({ to: APP_PAGES.dashboard.link });
              } else {
                // User needs to complete onboarding
                router.navigate({ to: APP_PAGES.onBoarding.link });
              }
            }
          }, VERIFY_SUCCESS_REDIRECT_DELAY);
        } else {
          // Only set error if not already in success state
          if (!isSuccessRef.current) {
            setStatus('error');
            setError(res?.message || t('auth.verifyEmail.error'));
          }
        }
      })
      .catch((err) => {
        console.error('Verify email error:', err); // Debug log
        // Only set error if not already in success state
        if (!isSuccessRef.current) {
          setStatus('error');
          setError(err?.message || t('auth.verifyEmail.error'));
        }
      });
  }, [search, t, router]);

  if (status === 'loading') {
    return <LoadingPage message={t('auth.verifyEmail.loading')} />;
  }
  if (status === 'error') {
    return <ErrorSection message={error} />;
  }
  return (
    <div className='min-h-screen bg-background text-text-primary flex flex-col items-center justify-center px-4'>
      <div className='max-w-xl w-full text-center'>
        {/* Success Icon Section */}
        <div className='mb-8 animate-bounce'>
          <div className='relative mx-auto w-32 h-32 mb-6'>
            {/* Success icon with gradient background */}
            <div className='absolute inset-0 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20'>
              <svg
                className='w-12 h-12 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            {/* Decorative floating elements */}
            <div className='absolute -top-3 -right-3 w-8 h-8 bg-green-400 rounded-full animate-pulse opacity-80 shadow-lg'></div>
            <div
              className='absolute -bottom-3 -left-3 w-6 h-6 bg-green-300 rounded-full animate-pulse opacity-70 shadow-md'
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className='absolute top-2 left-2 w-3 h-3 bg-green-200 rounded-full animate-ping opacity-60'
              style={{ animationDelay: '1s' }}
            ></div>
          </div>
        </div>

        {/* Content Section */}
        <div className='space-y-6'>
          <h1 className='text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-4 tracking-tight'>
            {t('auth.verifyEmail.successTitle')}
          </h1>

          <p className='text-lg text-text-secondary max-w-lg mx-auto leading-relaxed'>
            {successMessage}
          </p>

          <p className='text-sm text-text-secondary'>{t('auth.verifyEmail.redirecting')}</p>

          {/* Countdown indicator */}
          <div className='flex justify-center space-x-2'>
            <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
            <div
              className='w-3 h-3 bg-green-400 rounded-full animate-pulse'
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className='w-3 h-3 bg-green-300 rounded-full animate-pulse'
              style={{ animationDelay: '1s' }}
            ></div>
          </div>
        </div>

        {/* Floating Background Decorations */}
        <div className='fixed inset-0 pointer-events-none overflow-hidden -z-10'>
          {/* Large floating circles */}
          <div className='absolute top-20 left-10 w-4 h-4 bg-green-500 rounded-full animate-pulse opacity-30'></div>
          <div
            className='absolute top-1/3 right-16 w-6 h-6 bg-green-400 rounded-full animate-pulse opacity-25'
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className='absolute bottom-1/3 left-16 w-5 h-5 bg-green-300 rounded-full animate-pulse opacity-20'
            style={{ animationDelay: '1.5s' }}
          ></div>
          <div
            className='absolute bottom-24 right-12 w-3 h-3 bg-green-500 rounded-full animate-pulse opacity-35'
            style={{ animationDelay: '2s' }}
          ></div>

          {/* Large background gradient orbs */}
          <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-green-400/5 to-transparent rounded-full blur-3xl'></div>
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className='fixed inset-0 pointer-events-none opacity-[0.02] -z-20'
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        ></div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

import { useRouter } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Auth } from '../../../api/auth/auth';
import Logo from '../../../components/ui/Logo';
import { APP_PAGES } from '../../../constants/navigation';
import { getMessageByStatuscode, showStatusToast } from '../../../utils/statusMessage';

const EmailSentPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>('');

  // Protection: Check if user came from signup with email
  useEffect(() => {
    // Get email from URL parameters or session storage
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    const emailFromStorage = sessionStorage.getItem('signupEmail');
    const signupTimestamp = sessionStorage.getItem('signupTimestamp');

    // Check if we have a valid signup session (within last 5 minutes)
    const isValidSignupSession =
      signupTimestamp && Date.now() - parseInt(signupTimestamp) < 5 * 60 * 1000; // 5 minutes

    const emailFromSignup = emailFromUrl || emailFromStorage;

    // Only allow access if we have both email and a valid signup session
    if (!emailFromSignup || !isValidSignupSession) {
      // Clear any invalid data
      sessionStorage.removeItem('signupEmail');
      sessionStorage.removeItem('signupTimestamp');

      // Redirect to signup if no valid session
      router.navigate({ to: APP_PAGES.signUp.link });
      return;
    }

    setEmail(emailFromSignup);
    // Store email in session storage for resend functionality
    sessionStorage.setItem('signupEmail', emailFromSignup);
  }, [router]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error(t('auth.email_sent.no_email_error'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await Auth.resendVerification(email);

      const statusMessage = getMessageByStatuscode(response.statusCode, {
        t: t,
        showToast: true,
      });

      showStatusToast(statusMessage, toast);

      if (statusMessage.status === 'success') {
        toast.success(t('auth.email_sent.resend_success'));
      }
    } catch (error: any) {
      if (error?.statusCode) {
        const statusMessage = getMessageByStatuscode(error.statusCode, {
          t: t,
          showToast: true,
        });
        showStatusToast(statusMessage, toast);
      } else {
        toast.error(t('status.error.unexpected'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Clear the stored email and timestamp when going back to login
    sessionStorage.removeItem('signupEmail');
    sessionStorage.removeItem('signupTimestamp');
    router.navigate({ to: APP_PAGES.login.link });
  };

  const handleContactSupport = () => {
    // TODO: Implement contact support functionality
    console.log('Contact support clicked');
    toast(t('auth.email_sent.contact_support_info'));
  };

  // Show loading while checking protection
  if (!email) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col'>
      {/* Header with Logo */}
      <div className='flex justify-center pt-8'>
        <Logo />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 py-8'>
        <div className='max-w-lg w-full'>
          {/* Welcome Section */}
          <div className='text-center mb-8'>
            {/* Welcome Title */}
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
              {t('auth.email_sent.welcome_title')}
            </h1>

            {/* Welcome Message */}
            <p className='text-lg text-gray-700 mb-2'>{t('auth.email_sent.welcome_message')}</p>
          </div>

          {/* Success Message */}
          <div className='bg-green-50 border border-green-200 rounded-xl p-6 mb-6 shadow-sm'>
            <div className='flex items-start'>
              <svg
                className='w-6 h-6 text-green-600 mt-0.5 mr-3 flex-shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <div className='text-sm text-green-800'>
                <p className='font-semibold mb-2 text-base'>{t('auth.email_sent.success_title')}</p>
                <p className='leading-relaxed'>{t('auth.email_sent.success_description')}</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className='bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm'>
            <div className='flex items-start'>
              <svg
                className='w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <div className='text-sm text-blue-800'>
                <p className='font-semibold mb-2 text-base'>{t('auth.email_sent.info_title')}</p>
                <p className='leading-relaxed'>{t('auth.email_sent.info_description')}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-4'>
            {/* Resend Email Button */}
            <button
              onClick={handleResendEmail}
              disabled={isLoading}
              className='cursor-pointer w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              {isLoading ? t('auth.email_sent.resending') : t('auth.email_sent.resend_button')}
            </button>

            {/* Back to Login Button */}
            <button
              onClick={handleBackToLogin}
              className='cursor-pointer w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'
            >
              {t('auth.email_sent.back_to_login_button')}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='text-center py-6'>
        <p className='text-sm text-gray-500'>{t('footer.copyright')}</p>
      </div>
    </div>
  );
};

export default EmailSentPage;

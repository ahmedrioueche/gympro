import { useNavigate } from '@tanstack/react-router';
import { Key, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Auth } from '../../../api/auth/auth';
import Hero from '../../../components/Hero';
import Button from '../../../components/ui/Button';
import InputField from '../../../components/ui/InputField';
import { APP_PAGES } from '../../../constants/navigation';
import { getMessageByStatuscode, showStatusToast } from '../../../utils/statusMessage';
import AuthHeader from '../components/AuthHeader';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for Google OAuth error in URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error === 'google_auth_failed') {
      toast.error(t('auth.google_auth_error'));
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [t]);

  // Validation function (returns boolean - no error messages)
  const isFormValid = () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return false;
    if (!password || password.length < 8) return false;
    return true;
  };
  const isEmailValid = !!email.trim() && /^\S+@\S+\.\S+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await Auth.signIn({
        email: email,
        password: password,
        rememberMe: rememberMe,
      });

      const statusMessage = getMessageByStatuscode(response.statusCode, {
        t: t,
        showToast: true,
      });

      showStatusToast(statusMessage, toast);

      if (statusMessage.status === 'success') {
        window.location.href = APP_PAGES.main.link;
      }
    } catch (error: any) {
      if (error?.statusCode) {
        const statusMessage = getMessageByStatuscode(error.statusCode, {
          t: t,
          showToast: true,
        });

        showStatusToast(statusMessage, toast);
      } else {
        // Handle unexpected errors
        toast.error(t('status.error.unexpected'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await Auth.getGoogleAuthUrl();
      if (response.success && response.data) {
        window.location.href = response.data.authUrl;
      } else {
        throw new Error('Failed to get Google auth URL');
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(t('auth.google_auth_error'));
    }
  };

  // Check if form is valid for button disabling
  const formIsValid = isFormValid();

  return (
    <div className='min-h-screen bg-background flex'>
      {/* Left Side - Login Form */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <AuthHeader />

          {/* Form */}
          <form className='mt-8 space-y-6' onSubmit={handleLogin}>
            <div className='space-y-4'>
              {/* Email Field */}
              <div>
                <InputField
                  id='email'
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.email_placeholder')}
                  className='pl-12'
                  leftIcon={<Mail className='h-5 w-5' />}
                />
              </div>

              {/* Password Field */}
              <div>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-text-secondary' />
                  </div>
                  <InputField
                    id='password'
                    type='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.password_placeholder')}
                    className='pl-12 pr-12'
                    leftIcon={<Key />}
                  />
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center cursor-pointer'>
                <input
                  id='remember-me'
                  type='checkbox'
                  className='cursor-pointer h-4 w-4 text-primary bg-surface border-border rounded focus:ring-2 focus:ring-primary'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-text-secondary cursor-pointer'
                >
                  {t('auth.remember_me')}
                </label>
              </div>
              <button
                type='button'
                className={` text-sm font-medium transition-colors ${
                  isEmailValid
                    ? 'text-primary hover:text-secondary cursor-pointer'
                    : 'text-gray-400'
                }`}
                disabled={!isEmailValid}
                onClick={() => {
                  if (isEmailValid) {
                    navigate({ to: '/auth/forgot-password', search: { email } });
                  }
                }}
              >
                {t('auth.forgot_password')}
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type='submit'
              size='lg'
              disabled={!formIsValid || isLoading}
              className='group relative w-full flex justify-center !py-4 px-4 font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              loading={isLoading}
            >
              {t('auth.sign_in')}
            </Button>

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-border' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-background text-text-secondary'>
                  {t('auth.or_continue_with')}
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type='button'
              onClick={handleGoogleLogin}
              className='w-full flex items-center justify-center px-4 py-3 border border-border rounded-xl bg-surface hover:bg-border text-text-primary font-medium transition-all duration-200 transform cursor-pointer'
            >
              <svg className='w-5 h-5 mr-3' viewBox='0 0 24 24'>
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              {t('auth.continue_with_google')}
            </button>

            {/* Sign Up Link */}
            <div className='text-center'>
              <p className='text-text-secondary'>
                {t('auth.dont_have_account')}{' '}
                <button
                  onClick={() => (window.location.href = APP_PAGES.signUp.link)}
                  type='button'
                  className='cursor-pointer font-medium text-primary hover:text-secondary transition-colors'
                >
                  {t('auth.sign_up')}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Hero />
    </div>
  );
}

export default LoginPage;

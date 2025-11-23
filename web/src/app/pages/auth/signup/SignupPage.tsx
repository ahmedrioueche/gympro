import { authApi } from '@ahmedrioueche/gympro-client';
import { Key, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Hero from '../../../../components/Hero';
import Button from '../../../../components/ui/Button';
import InputField from '../../../../components/ui/InputField';
import { APP_PAGES } from '../../../../constants/navigation';
import { useUserStore } from '../../../../store/user';
import { getMessage, showStatusToast } from '../../../../utils/statusMessage';
import AuthHeader from '../components/AuthHeader';

function SignupPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation function (returns boolean - no error messages)
  const isFormValid = () => {
    const { email, password, confirmPassword } = formData;

    // Basic validation checks
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return false;
    if (!password || password.length < 8) return false;
    if (password !== confirmPassword) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't submit if form is invalid
    if (!isFormValid()) return;

    setIsLoading(true);

    try {
      const response = await authApi.signup({
        email: formData.email,
        password: formData.password,
      });

      //Handle status code with toast
      const statusMessage = getMessage(response, {
        t: t,
        showToast: true,
      });

      showStatusToast(statusMessage, toast);
      if (response.success) {
        setUser(response.data.user);
        window.location.href = `${APP_PAGES.email_sent.link}?email=${encodeURIComponent(
          formData.email
        )}`;
      }
    } catch (error: any) {
      // Handle API errors with status codes
      if (error?.statusCode) {
        const statusMessage = getMessage(error, {
          t: t,
          showToast: true,
        });

        showStatusToast(statusMessage, toast);
      } else {
        toast.error(t('status.error.unexpected'));
      }
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.getGoogleAuthUrl();
      window.location.href = response.data?.authUrl;
    } catch (error) {
      setIsLoading(false);
      toast.error(t('auth.google_auth_error'));
    }
  };

  // Check if form is valid for button disabling
  const formIsValid = isFormValid();

  return (
    <div className='min-h-screen bg-background flex'>
      {/* Left Side - Signup Form */}
      <div className='overflow-y-auto flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <AuthHeader type='signup' />
          {/* Form */}
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-4'>
              {/* Email Field */}
              <div>
                <InputField
                  id='email'
                  name='email'
                  type='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('auth.email_placeholder')}
                  className='pl-12'
                  leftIcon={<Mail className='h-5 w-5' />}
                />
              </div>

              {/* Password Field */}
              <div>
                <InputField
                  id='password'
                  name='password'
                  type='password'
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('auth.password_placeholder')}
                  className='pl-12'
                  leftIcon={<Lock className='h-5 w-5' />}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <InputField
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t('auth.confirm_password_placeholder')}
                  className='pl-12'
                  leftIcon={<Key className='h-5 w-5' />}
                />
              </div>
            </div>

            {/* Sign Up Button - Disabled when form is invalid */}
            <Button
              type='submit'
              size='lg'
              disabled={!formIsValid || isLoading}
              className='group relative w-full flex justify-center !py-4 px-4 font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              loading={isLoading}
            >
              {t('auth.sign_up')}
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

            {/* Google Sign Up */}
            <button
              type='button'
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className='cursor-pointer w-full flex items-center justify-center px-4 py-3 border border-border rounded-xl bg-surface hover:bg-border text-text-primary font-medium transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed'
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

            {/* Login Link */}
            <div className='text-center'>
              <p className='text-text-secondary'>
                {t('auth.already_have_account')}{' '}
                <a
                  href={APP_PAGES.login.link}
                  className='font-medium text-primary hover:text-secondary transition-colors'
                >
                  {t('auth.sign_in')}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Hero />
    </div>
  );
}

export default SignupPage;

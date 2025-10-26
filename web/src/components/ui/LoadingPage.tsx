import { Loader } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const LoadingPage: React.FC<{ type?: 'inner' | 'outer'; message?: string }> = ({
  type = 'outer',
  message,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`min-h-screen bg-background text-text-primary flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        type === 'inner'
          ? 'bg-light-background dark:bg-dark-background'
          : 'bg-gradient-to-br from-light-primary/10 to-light-secondary/10 dark:from-slate-800 dark:via-slate-700/20 dark:to-slate-900'
      }`}
    >
      {/* Logo at the top */}
      <div className='mb-8'>
        <Logo />
      </div>

      <div className='max-w-xl w-full text-center'>
        {/* Loading Animation */}
        <div className='mb-8 animate-pulse'>
          <div className='relative mx-auto w-32 h-32 mb-6'>
            {/* Loading spinner with gradient background */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-2xl shadow-primary/20'>
              <Loader className='w-12 h-12 text-white animate-spin' />
            </div>
            {/* Decorative floating elements */}
            <div className='absolute -top-3 -right-3 w-8 h-8 bg-secondary rounded-full animate-pulse opacity-80 shadow-lg'></div>
            <div
              className='absolute -bottom-3 -left-3 w-6 h-6 bg-accent rounded-full animate-pulse opacity-70 shadow-md'
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className='absolute top-2 left-2 w-3 h-3 bg-primary rounded-full animate-ping opacity-60'
              style={{ animationDelay: '1s' }}
            ></div>
          </div>
        </div>

        {/* Content Section */}
        <div className='space-y-6'>
          <h2 className='text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight'>
            {message || t('general.loading')}
          </h2>

          <p className='text-lg text-text-secondary max-w-lg mx-auto leading-relaxed'>
            {t('general.please_wait')}
          </p>

          {/* Loading dots animation */}
          <div className='flex justify-center space-x-2'>
            <div className='w-3 h-3 bg-primary rounded-full animate-bounce'></div>
            <div
              className='w-3 h-3 bg-secondary rounded-full animate-bounce'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='w-3 h-3 bg-accent rounded-full animate-bounce'
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>

        {/* Floating Background Decorations */}
        <div className='fixed inset-0 pointer-events-none overflow-hidden -z-10'>
          {/* Large floating circles */}
          <div className='absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-pulse opacity-30'></div>
          <div
            className='absolute top-1/3 right-16 w-6 h-6 bg-secondary rounded-full animate-pulse opacity-25'
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className='absolute bottom-1/3 left-16 w-5 h-5 bg-accent rounded-full animate-pulse opacity-20'
            style={{ animationDelay: '1.5s' }}
          ></div>
          <div
            className='absolute bottom-24 right-12 w-3 h-3 bg-primary rounded-full animate-pulse opacity-35'
            style={{ animationDelay: '2s' }}
          ></div>

          {/* Large background gradient orbs */}
          <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-3xl'></div>
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

export default LoadingPage;

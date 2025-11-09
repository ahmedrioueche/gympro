import { useTranslation } from 'react-i18next';
import Logo from '../../../../components/ui/Logo';
import './style.css';

const AuthHeader = ({ type = 'login' }: { type?: 'login' | 'signup' }) => {
  const { t } = useTranslation();

  const title = type === 'login' ? t('auth.welcome_back') : t('auth.create_account');

  const subtitle = type === 'login' ? t('auth.sign_in_subtitle') : t('auth.sign_up_subtitle');

  return (
    <div className='text-center overflow-hidden'>
      <Logo />
      {title && <h2 className='text-3xl font-bold text-text-primary animate-fade-in'>{title}</h2>}
      {subtitle && <p className='mt-2 text-text-secondary'>{subtitle}</p>}
    </div>
  );
};

export default AuthHeader;

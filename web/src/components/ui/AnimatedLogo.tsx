import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AnimatedLogo = () => {
  const { t } = useTranslation();

  return (
    <div className='flex items-center justify-center mb-3 h-16 relative mx-auto w-[300px]'>
      {/* Zap Icon with smooth horizontal shift */}
      <div className='zap-container animate-zap-move'>
        <div className='w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg zap-shine'>
          <Zap className='w-8 h-8 text-white' />
        </div>
      </div>

      {/* App Name with slide-in and shiny effect */}
      <span className='md:text-3xl app-name animate-app-slide text-2xl font-bold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary'>
        {t('app.name')}
      </span>
    </div>
  );
};
export default AnimatedLogo;

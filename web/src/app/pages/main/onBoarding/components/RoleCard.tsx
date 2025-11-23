import type { UserRole } from '@ahmedrioueche/gympro-client';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Feature {
  icon: React.ReactNode;
  textKey: string;
}

interface RoleCardProps {
  role: {
    id: UserRole;
    icon: React.ReactNode;
    titleKey: string;
    descriptionKey: string;
    gradient: string;
    features: Feature[];
  };
  isSelected: boolean;
  onSelect: () => void;
  animationDelay: number;
}

export function RoleCard({ role, isSelected, onSelect, animationDelay }: RoleCardProps) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-105' : 'hover:scale-102'
      }`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div
        className={`relative bg-surface rounded-2xl p-6 md:p-8 border-2 transition-all duration-300 ${
          isSelected
            ? 'border-primary shadow-xl shadow-primary/20'
            : 'border-border hover:border-primary/50'
        }`}
      >
        {/* Gradient background on selection */}
        {isSelected && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-5 rounded-2xl`}
          />
        )}

        {/* Icon */}
        <div
          className={`relative inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${role.gradient} text-white mb-4 md:mb-6 shadow-lg`}
        >
          {role.icon}
        </div>

        {/* Title & Description */}
        <h3 className='relative text-xl md:text-2xl font-bold text-text-primary mb-2 md:mb-3'>
          {t(role.titleKey)}
        </h3>
        <p className='relative text-sm md:text-base text-text-secondary mb-4 md:mb-6'>
          {t(role.descriptionKey)}
        </p>

        {/* Features List */}
        {role.features.length > 0 && (
          <div className='relative space-y-2.5 md:space-y-3 mb-4 md:mb-6'>
            <p className='text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 md:mb-3 opacity-70'>
              {t('onboarding.keyFeatures')}
            </p>
            {role.features.map((feature, i) => (
              <div key={i} className='flex items-start gap-2.5 md:gap-3'>
                <div
                  className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-lg bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white opacity-80`}
                >
                  {feature.icon}
                </div>
                <span className='text-xs md:text-sm text-text-secondary leading-relaxed'>
                  {t(feature.textKey)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className='flex items-center gap-2 text-primary font-medium pt-3 md:pt-4 border-t border-border'>
            <div className='w-5 h-5 rounded-full bg-primary flex items-center justify-center'>
              <Check className='w-3 h-3 text-white' strokeWidth={3} />
            </div>
            <span className='text-sm'>{t('onboarding.selected')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

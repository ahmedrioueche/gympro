import type { UserRole } from '@ahmedrioueche/gympro-client';
import { useTranslation } from 'react-i18next';
import { getRoleFeaturesMap } from '../utils';
import { RoleCard } from './RoleCard';

interface RolesFeaturesStepProps {
  step: {
    titleKey: string;
    subtitleKey: string;
    descriptionKey: string;
  };
  roles: Array<{
    id: UserRole;
    icon: React.ReactNode;
    titleKey: string;
    descriptionKey: string;
    gradient: string;
  }>;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
}

export function RolesFeaturesStep({
  step,
  roles,
  selectedRole,
  setSelectedRole,
}: RolesFeaturesStepProps) {
  const { t } = useTranslation();
  const featuresMap = getRoleFeaturesMap();

  const rolesWithFeatures = roles.map((role) => ({
    ...role,
    features: featuresMap[role.id] || [],
  }));

  return (
    <div className='flex flex-col items-center justify-center h-full px-4 md:px-8 py-4'>
      {/* Header */}
      <header className='text-center mb-8 md:mb-12 max-w-2xl'>
        <h2 className='text-3xl md:text-5xl font-bold text-text-primary mb-4'>
          {t(step.titleKey)}
        </h2>
        <p className='text-lg md:text-xl text-secondary font-medium mb-3'>{t(step.subtitleKey)}</p>
        <p className='text-sm md:text-base text-text-secondary'>{t(step.descriptionKey)}</p>
      </header>

      {/* Role Cards */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl w-full'>
        {rolesWithFeatures.map((role, index) => (
          <RoleCard
            key={role.id}
            role={role}
            isSelected={selectedRole === role.id}
            onSelect={() => setSelectedRole(role.id)}
            animationDelay={index * 100}
          />
        ))}
      </div>
    </div>
  );
}

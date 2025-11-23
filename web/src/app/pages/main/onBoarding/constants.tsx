import { Crown, Trophy, UserCircle } from 'lucide-react';
import type { UserRole } from '@ahmedrioueche/gympro-client';

export const ONBOARDING_STEPS = [
  {
    id: 'role',
    titleKey: 'onboarding.roles.title',
    subtitleKey: 'onboarding.roles.subtitle',
    descriptionKey: 'onboarding.roles.description',
  },
  {
    id: 'details',
    titleKey: 'onboarding.details.title',
    subtitleKey: 'onboarding.details.subtitle',
    descriptionKey: 'onboarding.details.description',
  },
];

export const ONBOARDING_ROLES = [
  {
    id: 'owner' as UserRole,
    icon: <Crown className='w-8 h-8' />,
    titleKey: 'onboarding.roles.owner.title',
    descriptionKey: 'onboarding.roles.owner.description',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
  },

  {
    id: 'member' as UserRole,
    icon: <UserCircle className='w-8 h-8' />,
    titleKey: 'onboarding.roles.member.title',
    descriptionKey: 'onboarding.roles.member.description',
    gradient: 'from-green-400 via-teal-500 to-blue-500',
  },
  {
    id: 'coach' as UserRole,
    icon: <Trophy className='w-8 h-8' />,
    titleKey: 'onboarding.roles.coach.title',
    descriptionKey: 'onboarding.roles.coach.description',
    gradient: 'from-blue-400 via-purple-500 to-pink-500',
  },
];

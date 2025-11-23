import { Activity, Bell, Calendar, CreditCard, FileText, TrendingUp, Users } from 'lucide-react';

export const getRoleFeaturesMap = () => ({
  owner: [
    { icon: <Users className='w-4 h-4' />, textKey: 'onboarding.features.memberCoachManagement' },
    { icon: <TrendingUp className='w-4 h-4' />, textKey: 'onboarding.features.advancedAnalytics' },
    { icon: <CreditCard className='w-4 h-4' />, textKey: 'onboarding.features.paymentProcessing' },
    { icon: <Calendar className='w-4 h-4' />, textKey: 'onboarding.features.subscriptionTracking' },
    { icon: <Bell className='w-4 h-4' />, textKey: 'onboarding.features.automatedNotifications' },
  ],

  member: [
    { icon: <FileText className='w-4 h-4' />, textKey: 'onboarding.features.viewTrainingProgram' },
    { icon: <Activity className='w-4 h-4' />, textKey: 'onboarding.features.trackYourProgress' },
    {
      icon: <Calendar className='w-4 h-4' />,
      textKey: 'onboarding.features.seeSubscriptionStatus',
    },
    { icon: <Bell className='w-4 h-4' />, textKey: 'onboarding.features.getSessionReminders' },
  ],
  coach: [
    { icon: <Users className='w-4 h-4' />, textKey: 'onboarding.features.viewAssignedMembers' },
    {
      icon: <FileText className='w-4 h-4' />,
      textKey: 'onboarding.features.createTrainingPrograms',
    },
    { icon: <Activity className='w-4 h-4' />, textKey: 'onboarding.features.trackMemberProgress' },
    { icon: <Calendar className='w-4 h-4' />, textKey: 'onboarding.features.scheduleSessions' },
  ],
});

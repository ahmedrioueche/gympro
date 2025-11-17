export const APP_PAGES = {
  // Auth pages (public)
  login: {
    name: 'pages.login',
    link: '/auth/login',
  },
  signUp: {
    name: 'pages.signup',
    link: '/auth/signup',
  },
  email_verification: {
    name: 'pages.email_verification',
    link: '/verify',
  },
  email_sent: {
    name: 'pages.email_sent',
    link: '/auth/email-sent',
  },
  reset_password: {
    name: 'pages.reset_password',
    link: '/auth/reset-password',
  },
  forgot_password: {
    name: 'pages.forgot_password',
    link: '/auth/forgot-password',
  },

  // Onboarding (authenticated)
  onBoarding: {
    name: 'pages.onboarding',
    link: '/onboarding',
  },

  // Shared dashboard (all roles)
  dashboard: {
    name: 'pages.dashboard',
    link: '/dashboard',
  },

  // Owner/Manager pages
  manager: {
    name: 'pages.manager',
    link: '/manager',
    members: {
      name: 'pages.manager.members',
      link: '/manager/members',
    },
    subscriptions: {
      name: 'pages.manager.subscriptions',
      link: '/manager/subscriptions',
    },
    coaching: {
      name: 'pages.manager.coaching',
      link: '/manager/coaching',
    },
    payments: {
      name: 'pages.manager.payments',
      link: '/manager/payments',
    },
    analytics: {
      name: 'pages.manager.analytics',
      link: '/manager/analytics',
    },
    notifications: {
      name: 'pages.manager.notifications',
      link: '/manager/notifications',
    },
    settings: {
      name: 'pages.manager.settings',
      link: '/manager/settings',
    },
  },

  // Member pages
  member: {
    name: 'pages.member',
    link: '/member',
    subscription: {
      name: 'pages.member.subscription',
      link: '/member/subscription',
    },
    program: {
      name: 'pages.member.program',
      link: '/member/program',
    },
    progress: {
      name: 'pages.member.progress',
      link: '/member/progress',
    },
    attendance: {
      name: 'pages.member.attendance',
      link: '/member/attendance',
    },
    profile: {
      name: 'pages.member.profile',
      link: '/member/profile',
    },
    notifications: {
      name: 'pages.member.notifications',
      link: '/member/notifications',
    },
  },

  // Coach pages
  coach: {
    name: 'pages.coach',
    link: '/coach',
    members: {
      name: 'pages.coach.members',
      link: '/coach/members',
    },
    programs: {
      name: 'pages.coach.programs',
      link: '/coach/programs',
    },
    schedule: {
      name: 'pages.coach.schedule',
      link: '/coach/schedule',
    },
    analytics: {
      name: 'pages.coach.analytics',
      link: '/coach/analytics',
    },
    profile: {
      name: 'pages.coach.profile',
      link: '/coach/profile',
    },
    notifications: {
      name: 'pages.coach.notifications',
      link: '/coach/notifications',
    },
  },

  // Staff pages
  staff: {
    name: 'pages.staff',
    link: '/staff',
    attendance: {
      name: 'pages.staff.attendance',
      link: '/staff/attendance',
    },
    tasks: {
      name: 'pages.staff.tasks',
      link: '/staff/tasks',
    },
    schedule: {
      name: 'pages.staff.schedule',
      link: '/staff/schedule',
    },
    profile: {
      name: 'pages.staff.profile',
      link: '/staff/profile',
    },
    notifications: {
      name: 'pages.staff.notifications',
      link: '/staff/notifications',
    },
  },

  // Shared pages (could be accessed by multiple roles)
  profile: {
    name: 'pages.profile',
    link: '/profile',
  },
  notifications: {
    name: 'pages.notifications',
    link: '/notifications',
  },
  settings: {
    name: 'pages.settings',
    link: '/settings',
  },
};

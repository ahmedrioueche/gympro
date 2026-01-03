export const APP_PAGES = {
  // Auth pages (public)
  login: {
    name: "pages.login",
    link: "/auth/login",
  },
  signUp: {
    name: "pages.signup",
    link: "/auth/signup",
  },
  email_verification: {
    name: "pages.email_verification",
    link: "/verify",
  },
  email_sent: {
    name: "pages.email_sent",
    link: "/auth/email-sent",
  },
  reset_password: {
    name: "pages.reset_password",
    link: "/auth/reset-password",
  },
  forgot_password: {
    name: "pages.forgot_password",
    link: "/auth/forgot-password",
  },

  // Onboarding (authenticated)
  onBoarding: {
    name: "pages.onboarding",
    link: "/onboarding",
  },

  // Owner/Manager pages
  manager: {
    name: "pages.manager",
    link: "/manager",
    home: {
      name: "pages.manager.home",
      link: "/manager",
    },
    gyms: {
      name: "pages.manager.gyms",
      link: "/manager/gyms",
    },
    createGym: {
      name: "pages.manager.create_gym",
      link: "/manager/gyms/create",
    },
    subscriptions: {
      name: "pages.manager.subscriptions",
      link: "/manager/subscriptions",
    },

    coaching: {
      name: "pages.manager.coaching",
      link: "/manager/coaching",
    },
    subscription: {
      name: "pages.manager.subscription",
      link: "/manager/subscription",
    },
    payments: {
      name: "pages.manager.payments",
      link: "/manager/payments",
    },
    analytics: {
      name: "pages.manager.analytics",
      link: "/manager/analytics",
    },
    notifications: {
      name: "pages.manager.notifications",
      link: "/manager/notifications",
    },
    settings: {
      name: "pages.manager.settings",
      link: "/manager/settings",
    },
  },

  gym: {
    name: "pages.gym",
    link: "/gym",
    home: {
      name: "pages.gym.home",
      link: "/gym",
    },
    members: {
      name: "pages.gym.members",
      link: "/gym/members",
    },
    createMember: {
      name: "pages.gym.create_member",
      link: "/gym/members/create",
    },
    subscriptions: {
      name: "pages.gym.subscriptions",
      link: "/gym/subscriptions",
    },
    access: {
      name: "pages.gym.access",
      link: "/gym/access",
    },
    accessLogs: {
      name: "pages.gym.access",
      link: "/gym/access/logs",
    },
    analytics: {
      name: "pages.gym.analytics",
      link: "/gym/analytics",
    },
    notifications: {
      name: "pages.gym.notifications",
      link: "/gym/notifications",
    },
    settings: {
      name: "pages.gym.settings",
      link: "/gym/settings",
    },
  },

  // Member pages
  member: {
    name: "pages.member",
    link: "/member",
    home: {
      name: "pages.member.home",
      link: "/member",
    },
    gyms: {
      name: "pages.member.gyms",
      link: "/member/gyms",
    },
    subscriptions: {
      name: "pages.member.subscriptions",
      link: "/member/subscriptions",
    },
    programs: {
      name: "pages.member.programs",
      link: "/member/programs",
    },
    progress: {
      name: "pages.member.progress",
      link: "/member/progress",
    },
    attendance: {
      name: "pages.member.attendance",
      link: "/member/attendance",
    },
    training: {
      name: "pages.member.training",
      link: "/member/training",
    },
    notifications: {
      name: "pages.member.notifications",
      link: "/member/notifications",
    },
    settings: {
      name: "pages.member.settings",
      link: "/member/settings",
    },
  },

  // Coach pages
  coach: {
    name: "pages.coach",
    link: "/coach",
    members: {
      name: "pages.coach.members",
      link: "/coach/members",
    },
    programs: {
      name: "pages.coach.programs",
      link: "/coach/programs",
    },
    schedule: {
      name: "pages.coach.schedule",
      link: "/coach/schedule",
    },
    analytics: {
      name: "pages.coach.analytics",
      link: "/coach/analytics",
    },
    profile: {
      name: "pages.coach.profile",
      link: "/coach/profile",
    },
    notifications: {
      name: "pages.coach.notifications",
      link: "/coach/notifications",
    },
  },

  // Staff pages
  staff: {
    name: "pages.staff",
    link: "/staff",
    attendance: {
      name: "pages.staff.attendance",
      link: "/staff/attendance",
    },
    tasks: {
      name: "pages.staff.tasks",
      link: "/staff/tasks",
    },
    schedule: {
      name: "pages.staff.schedule",
      link: "/staff/schedule",
    },
    profile: {
      name: "pages.staff.profile",
      link: "/staff/profile",
    },
    notifications: {
      name: "pages.staff.notifications",
      link: "/staff/notifications",
    },
  },

  // Shared pages (could be accessed by multiple roles)
  profile: {
    name: "pages.profile",
    link: "/profile",
  },
  notifications: {
    name: "pages.notifications",
    link: "/notifications",
  },
  settings: {
    name: "pages.settings",
    link: "/settings",
  },
};

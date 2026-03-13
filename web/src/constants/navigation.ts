export const APP_PAGES = {
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

  onBoarding: {
    name: "pages.onboarding",
    link: "/onboarding",
  },

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
    support: {
      name: "pages.manager.support",
      link: "/manager/support",
    },
  },

  gym: {
    name: "pages.gym",
    link: "/gym",
    manager: {
      home: {
        name: "pages.gym.home",
        link: "/gym/manager",
      },
      members: {
        name: "pages.gym.members",
        link: "/gym/manager/members",
      },

      pricing: {
        name: "pages.gym.pricing",
        link: "/gym/manager/pricing",
      },
      subscriptions: {
        name: "pages.gym.subscriptions",
        link: "/gym/manager/subscriptions",
      },
      access: {
        name: "pages.gym.access",
        link: "/gym/manager/access",
      },
      staff: {
        name: "pages.gym.staff",
        link: "/gym/manager/staff",
      },
      coaching: {
        name: "pages.gym.coaching",
        link: "/gym/manager/coaching",
      },
      attendance: {
        name: "pages.gym.attendance",
        link: "/gym/manager/attendance",
      },
      inventory: {
        name: "pages.gym.inventory",
        link: "/gym/manager/inventory",
      },
      store: {
        name: "pages.gym.store",
        link: "/gym/manager/store",
      },
      competitions: {
        name: "pages.gym.competitions",
        link: "/gym/manager/competitions",
      },
      classes: {
        name: "pages.gym.classes",
        link: "/gym/manager/classes",
      },

      announcements: {
        name: "pages.gym.announcements",
        link: "/gym/manager/announcements",
      },
      marketing: {
        name: "pages.gym.marketing",
        link: "/gym/manager/marketing",
      },
      analytics: {
        name: "pages.gym.analytics",
        link: "/gym/manager/analytics",
      },
      notifications: {
        name: "pages.gym.notifications",
        link: "/gym/manager/notifications",
      },
      settings: {
        name: "pages.gym.settings",
        link: "/gym/manager/settings",
      },
    },
    member: {
      home: {
        name: "pages.gym.home",
        link: "/gym/member",
      },
      classes: {
        name: "pages.gym.classes",
        link: "/gym/member/classes",
      },
      subscriptions: {
        name: "pages.gym.subscriptions",
        link: "/gym/member/subscriptions",
      },
      access: {
        name: "pages.gym.access",
        link: "/gym/member/access",
      },
      attendance: {
        name: "pages.gym.attendance",
        link: "/gym/member/attendance",
      },
      store: {
        name: "pages.gym.store",
        link: "/gym/member/store",
      },
      inventory: {
        name: "pages.gym.inventory",
        link: "/gym/member/inventory",
      },
      competitions: {
        name: "pages.gym.competitions",
        link: "/gym/member/competitions",
      },
      announcements: {
        name: "pages.gym.announcements",
        link: "/gym/member/announcements",
      },
      notifications: {
        name: "pages.gym.notifications",
        link: "/gym/member/notifications",
      },
      settings: {
        name: "pages.gym.settings",
        link: "/gym/member/settings",
      },
    },
    coach: {
      home: {
        name: "pages.gym.home",
        link: "/gym/coach",
      },
      clients: {
        name: "pages.gym.clients",
        link: "/gym/coach/clients",
      },
      schedule: {
        name: "pages.gym.schedule",
        link: "/gym/coach/schedule",
      },
      payments: {
        name: "pages.gym.payments",
        link: "/gym/coach/payments",
      },
      inventory: {
        name: "pages.gym.inventory",
        link: "/gym/coach/inventory",
      },
      store: {
        name: "pages.gym.store",
        link: "/gym/coach/store",
      },
      competitions: {
        name: "pages.gym.competitions",
        link: "/gym/coach/competitions",
      },
      analytics: {
        name: "pages.gym.analytics",
        link: "/gym/coach/analytics",
      },
      announcements: {
        name: "pages.gym.announcements",
        link: "/gym/coach/announcements",
      },
      access: {
        name: "pages.gym.access",
        link: "/gym/coach/access",
      },
      notifications: {
        name: "pages.gym.notifications",
        link: "/gym/coach/notifications",
      },
      settings: {
        name: "pages.gym.settings",
        link: "/gym/coach/settings",
      },
    },
  },

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
    exercises: {
      name: "pages.member.exercises",
      link: "/member/exercises",
    },
    coaches: {
      name: "pages.member.coaches",
      link: "/member/coaches",
    },
    attendance: {
      name: "pages.member.attendance",
      link: "/member/attendance",
    },
    training: {
      name: "pages.member.training",
      link: "/member/training",
    },
    schedule: {
      name: "pages.member.schedule",
      link: "/member/schedule",
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

  coach: {
    name: "pages.coach",
    link: "/coach",
    home: {
      name: "pages.coach.home",
      link: "/coach",
    },
    gyms: {
      name: "pages.coach.gyms",
      link: "/coach/gyms",
    },
    clients: {
      name: "pages.coach.clients",
      link: "/coach/clients",
    },
    pricing: {
      name: "pages.coach.pricing",
      link: "/coach/pricing",
    },
    payments: {
      name: "pages.coach.payments",
      link: "/coach/payments",
    },
    programs: {
      name: "pages.coach.programs",
      link: "/coach/programs",
    },
    exercises: {
      name: "pages.coach.exercises",
      link: "/coach/exercises",
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
    settings: {
      name: "pages.coach.settings",
      link: "/coach/settings",
    },
  },
  admin: {
    name: "pages.admin",
    link: "/admin",
    home: {
      name: "pages.admin.home",
      link: "/admin",
    },
    subscriptions: {
      name: "pages.admin.subscriptions",
      link: "/admin/subscriptions",
    },
    revenue: {
      name: "pages.admin.revenue",
      link: "/admin/revenue",
    },
    pricing: {
      name: "pages.admin.pricing",
      link: "/admin/pricing",
    },
    gyms: {
      name: "pages.admin.gyms",
      link: "/admin/gyms",
    },
    users: {
      name: "pages.admin.users",
      link: "/admin/users",
    },
    coaching: {
      name: "pages.admin.coaching",
      link: "/admin/coaching",
    },
    analytics: {
      name: "pages.admin.analytics",
      link: "/admin/analytics",
    },
    staff: {
      name: "pages.admin.staff",
      link: "/admin/staff",
    },
    alerts: {
      name: "pages.admin.alerts",
      link: "/admin/alerts",
    },
    reports: {
      name: "pages.admin.reports",
      link: "/admin/reports",
    },
    notifications: {
      name: "pages.admin.notifications",
      link: "/admin/notifications",
    },
    settings: {
      name: "pages.admin.settings",
      link: "/admin/settings",
    },
  },
  landing: {
    name: "pages.landing",
    link: "/landing",
    home: {
      name: "pages.landing.home",
      link: "/landing",
    },
    manager: {
      name: "pages.landing.manager",
      link: "/landing/manager",
    },
    member: {
      name: "pages.landing.member",
      link: "/landing/member",
    },
    coach: {
      name: "pages.landing.coach",
      link: "/landing/coach",
    },
    terms: {
      name: "pages.landing.terms",
      link: "/landing/terms",
    },
    privacy: {
      name: "pages.landing.privacy",
      link: "/landing/privacy",
    },
    cookies: {
      name: "pages.landing.cookies",
      link: "/landing/cookies",
    },
  },
};

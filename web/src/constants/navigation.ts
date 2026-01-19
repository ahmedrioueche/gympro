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
    manager: {
      home: {
        name: "pages.gym.home",
        link: "/gym/manager",
      },
      members: {
        name: "pages.gym.members",
        link: "/gym/manager/members",
      },
      member_profile: {
        name: "pages.gym.member_profile",
        link: "/gym/manager/members/profile",
      },
      create_member: {
        name: "pages.gym.create_member",
        link: "/gym/manager/members/create",
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
      notifications: {
        name: "pages.gym.notifications",
        link: "/gym/member/notifications",
      },
      settings: {
        name: "pages.gym.settings",
        link: "/gym/member/settings",
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

  public: {
    name: "pages.public",
    link: "/public",
    coach_profile: {
      name: "pages.public.coach_profile",
      link: "/public/coach/profile",
    },
    member_profile: {
      name: "pages.public.member_profile",
      link: "/public/member/profile",
    },
  },
};

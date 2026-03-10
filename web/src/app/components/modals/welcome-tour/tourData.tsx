import type { TFunction } from "i18next";
import {
  Activity,
  BarChart3,
  Calendar,
  Clipboard,
  Dumbbell,
  MapPin,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import React, { type ReactNode } from "react";
import {
  DummyAccountSettings,
  DummyBecomeCoach,
  DummyCoachCard,
  DummyCoachClients,
  DummyCoachSchedule,
  DummyGymNetwork,
  DummyManagerClasses,
  DummyManagerCoaches,
  DummyManagerRevenue,
  DummyManagerSettings,
  DummyProgramCard,
  DummyProgressChart,
  DummySchedule,
  DummyTrainingSession,
  DummyUserManagement,
  DummyWelcome,
} from "../../dummies";

export interface TourStep {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  content: ReactNode;
  icon?: React.ElementType;
}

export const getTourSteps = (t: TFunction, role: string): TourStep[] => {
  if (role === "member") {
    return [
      {
        id: "member-welcome",
        title: t("welcomeTour.member.welcome.title"),
        subtitle: t("welcomeTour.member.welcome.subtitle"),
        description: t("welcomeTour.member.welcome.desc"),
        icon: Sparkles,
        content: <DummyWelcome />,
      },
      {
        id: "member-programs",
        title: t("welcomeTour.member.step1.title"),
        subtitle: t("welcomeTour.member.step1.subtitle"),
        description: t("welcomeTour.member.step1.desc"),
        icon: Clipboard,
        content: <DummyProgramCard />,
      },
      {
        id: "member-training",
        title: t("welcomeTour.member.step2.title"),
        subtitle: t("welcomeTour.member.step2.subtitle"),
        description: t("welcomeTour.member.step2.desc"),
        icon: Dumbbell,
        content: <DummyTrainingSession />,
      },
      {
        id: "member-progress",
        title: t("welcomeTour.member.step3.title"),
        subtitle: t("welcomeTour.member.step3.subtitle"),
        description: t("welcomeTour.member.step3.desc"),
        icon: BarChart3,
        content: <DummyProgressChart />,
      },
      {
        id: "member-coaching",
        title: t("welcomeTour.member.step4.title"),
        subtitle: t("welcomeTour.member.step4.subtitle"),
        description: t("welcomeTour.member.step4.desc"),
        icon: UserCheck,
        content: <DummyCoachCard />,
      },
      {
        id: "member-schedule",
        title: t("welcomeTour.member.step5.title"),
        subtitle: t("welcomeTour.member.step5.subtitle"),
        description: t("welcomeTour.member.step5.desc"),
        icon: Calendar,
        content: <DummySchedule />,
      },
      {
        id: "member-become-coach",
        title: t("welcomeTour.member.step6.title"),
        subtitle: t("welcomeTour.member.step6.subtitle"),
        description: t("welcomeTour.member.step6.desc"),
        icon: Activity,
        content: <DummyBecomeCoach />,
      },
      {
        id: "member-settings",
        title: t("welcomeTour.member.step7.title"),
        subtitle: t("welcomeTour.member.step7.subtitle"),
        description: t("welcomeTour.member.step7.desc"),
        icon: Settings,
        content: <DummyAccountSettings />,
      },
    ];
  }

  if (role === "manager" || role === "owner") {
    return [
      {
        id: "manager-welcome",
        title: t("welcomeTour.manager.welcome.title"),
        subtitle: t("welcomeTour.manager.welcome.subtitle"),
        description: t("welcomeTour.manager.welcome.desc"),
        icon: Sparkles,
        content: <DummyWelcome />,
      },
      {
        id: "manager-revenue",
        title: t("welcomeTour.manager.step1.title"),
        subtitle: t("welcomeTour.manager.step1.subtitle"),
        description: t("welcomeTour.manager.step1.desc"),
        icon: TrendingUp,
        content: <DummyManagerRevenue />,
      },
      {
        id: "manager-users",
        title: t("welcomeTour.manager.step2.title"),
        subtitle: t("welcomeTour.manager.step2.subtitle"),
        description: t("welcomeTour.manager.step2.desc"),
        icon: Shield,
        content: <DummyUserManagement />,
      },
      {
        id: "manager-coaches",
        title: t("welcomeTour.manager.step3.title"),
        subtitle: t("welcomeTour.manager.step3.subtitle"),
        description: t("welcomeTour.manager.step3.desc"),
        icon: UserCheck,
        content: <DummyManagerCoaches />,
      },
      {
        id: "manager-classes",
        title: t("welcomeTour.manager.step4.title"),
        subtitle: t("welcomeTour.manager.step4.subtitle"),
        description: t("welcomeTour.manager.step4.desc"),
        icon: Calendar,
        content: <DummyManagerClasses />,
      },
      {
        id: "manager-settings",
        title: t("welcomeTour.manager.step5.title"),
        subtitle: t("welcomeTour.manager.step5.subtitle"),
        description: t("welcomeTour.manager.step5.desc"),
        icon: Settings,
        content: <DummyManagerSettings />,
      },
    ];
  }

  if (role === "coach") {
    return [
      {
        id: "coach-welcome",
        title: t("welcomeTour.coach.welcome.title"),
        subtitle: t("welcomeTour.coach.welcome.subtitle"),
        description: t("welcomeTour.coach.welcome.desc"),
        icon: Sparkles,
        content: <DummyWelcome />,
      },
      {
        id: "coach-gyms",
        title: t("welcomeTour.coach.step1.title"),
        subtitle: t("welcomeTour.coach.step1.subtitle"),
        description: t("welcomeTour.coach.step1.desc"),
        icon: MapPin,
        content: <DummyGymNetwork />,
      },
      {
        id: "coach-clients",
        title: t("welcomeTour.coach.step2.title"),
        subtitle: t("welcomeTour.coach.step2.subtitle"),
        description: t("welcomeTour.coach.step2.desc"),
        icon: Users,
        content: <DummyCoachClients />,
      },
      {
        id: "coach-classes",
        title: t("welcomeTour.coach.step3.title"),
        subtitle: t("welcomeTour.coach.step3.subtitle"),
        description: t("welcomeTour.coach.step3.desc"),
        icon: Dumbbell,
        content: (
          <DummyManagerClasses
            title={t("welcomeTour.coach.step3.title")}
            locationKey="coachClasses"
          />
        ),
      },
      {
        id: "coach-schedule",
        title: t("welcomeTour.coach.step4.title"),
        subtitle: t("welcomeTour.coach.step4.subtitle"),
        description: t("welcomeTour.coach.step4.desc"),
        icon: Calendar,
        content: <DummyCoachSchedule />,
      },
      {
        id: "coach-revenue",
        title: t("welcomeTour.coach.step5.title"),
        subtitle: t("welcomeTour.coach.step5.subtitle"),
        description: t("welcomeTour.coach.step5.desc"),
        icon: TrendingUp,
        content: (
          <DummyManagerRevenue
            title={t("welcomeTour.coach.step5.title")}
            locationKey="coachRevenue"
          />
        ),
      },
      {
        id: "coach-settings",
        title: t("welcomeTour.coach.step6.title"),
        subtitle: t("welcomeTour.coach.step6.subtitle"),
        description: t("welcomeTour.coach.step6.desc"),
        icon: Settings,
        content: (
          <DummyAccountSettings
            title={t("welcomeTour.coach.step6.title")}
            locationKey="coachSettings"
          />
        ),
      },
    ];
  }

  return [];
};

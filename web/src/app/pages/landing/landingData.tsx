import { type TFunction } from "i18next";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

export const getManagerFeatures = (t: TFunction) => [
  {
    icon: BarChart3,
    title: t("landing.roleSections.manager.features.analytics.title"),
    description: t("landing.roleSections.manager.features.analytics.desc"),
  },
  {
    icon: Users,
    title: t("landing.roleSections.manager.features.lifecycle.title"),
    description: t("landing.roleSections.manager.features.lifecycle.desc"),
  },
  {
    icon: Zap,
    title: t("landing.roleSections.manager.features.operations.title"),
    description: t("landing.roleSections.manager.features.operations.desc"),
  },
  {
    icon: ShieldCheck,
    title: t("landing.roleSections.manager.features.payments.title"),
    description: t("landing.roleSections.manager.features.payments.desc"),
  },
];

export const getMemberFeatures = (t: TFunction) => [
  {
    icon: Zap,
    title: t("landing.roleSections.member.features.programs.title"),
    description: t("landing.roleSections.member.features.programs.desc"),
  },
  {
    icon: BarChart3,
    title: t("landing.roleSections.member.features.tracking.title"),
    description: t("landing.roleSections.member.features.tracking.desc"),
  },
  {
    icon: Trophy,
    title: t("landing.roleSections.member.features.community.title"),
    description: t("landing.roleSections.member.features.community.desc"),
  },
  {
    icon: Calendar,
    title: t("landing.roleSections.member.features.booking.title"),
    description: t("landing.roleSections.member.features.booking.desc"),
  },
];

export const getCoachFeatures = (t: TFunction) => [
  {
    icon: ClipboardList,
    title: t("landing.roleSections.coach.features.builder.title"),
    description: t("landing.roleSections.coach.features.builder.desc"),
  },
  {
    icon: Users,
    title: t("landing.roleSections.coach.features.clients.title"),
    description: t("landing.roleSections.coach.features.clients.desc"),
  },
  {
    icon: MessageSquare,
    title: t("landing.roleSections.coach.features.messaging.title"),
    description: t("landing.roleSections.coach.features.messaging.desc"),
  },
  {
    icon: TrendingUp,
    title: t("landing.roleSections.coach.features.analytics.title"),
    description: t("landing.roleSections.coach.features.analytics.desc"),
  },
];

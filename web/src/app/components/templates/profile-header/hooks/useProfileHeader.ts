import {
  type GetSubscriptionDto,
  type User,
} from "@ahmedrioueche/gympro-client";
import { AlertCircle, CheckCircle2, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useUserStore } from "../../../../../store/user";

export function useProfileHeader(
  user: User,
  subscription?: GetSubscriptionDto | null,
) {
  const { t } = useTranslation();
  const { activeDashboard } = useUserStore();

  let role = activeDashboard as string;
  if (activeDashboard === "manager") {
    role = user.role;
  }

  const getAccountStatus = () => {
    if (!subscription) {
      if (user.role === "coach") {
        return {
          label: t("home.manager.profile.status.active"),
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/20",
          icon: CheckCircle2,
        };
      }
      return {
        label: t("home.manager.profile.status.unknown"),
        color: "text-text-secondary",
        bgColor: "bg-surface-hover",
        borderColor: "border-border",
        icon: AlertCircle,
      };
    }

    if (!subscription?.plan) {
      return {
        label: t("home.manager.profile.status.free"),
        color: "text-text-secondary",
        bgColor: "bg-surface-hover",
        borderColor: "border-border",
        icon: AlertCircle,
      };
    }

    if (subscription.trial && !subscription.trial.convertedToPaid) {
      return {
        label: t("home.manager.profile.status.freeTrial"),
        color: "text-warning",
        bgColor: "bg-warning/10",
        borderColor: "border-warning/20",
        icon: AlertCircle,
      };
    }

    if (subscription.status === "active") {
      return {
        label:
          subscription.plan.name || t("home.manager.profile.status.active"),
        color: "text-success",
        bgColor: "bg-success/10",
        borderColor: "border-success/20",
        icon: CheckCircle2,
      };
    }

    if (subscription.status === "cancelled") {
      return {
        label: t("home.manager.profile.status.cancelled"),
        color: "text-danger",
        bgColor: "bg-danger/10",
        borderColor: "border-danger/20",
        icon: AlertCircle,
      };
    }

    return {
      label: subscription.plan.name || t("home.manager.profile.status.active"),
      color: "text-text-secondary",
      bgColor: "bg-surface-hover",
      borderColor: "border-border",
      icon: CheckCircle2,
    };
  };

  const accountStatus = getAccountStatus();
  const StatusIcon: LucideIcon = accountStatus.icon;

  const getLocation = () => {
    const parts = [
      user.profile.city,
      user.profile.state,
      user.profile.country,
    ].filter(Boolean);
    return (
      parts.join(", ") ||
      user.appSettings?.locale?.regionName ||
      t("home.manager.profile.noLocation")
    );
  };

  const getRoleDisplay = () => {
    const roleKey = `home.manager.profile.roles.${role}`;
    return t(roleKey);
  };

  return {
    accountStatus,
    StatusIcon,
    location: getLocation(),
    roleDisplay: getRoleDisplay(),
  };
}

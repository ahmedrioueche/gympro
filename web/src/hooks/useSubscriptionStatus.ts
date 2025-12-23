import {
  type AppPlan,
  type AppSubscriptionBillingCycle,
  type GetSubscriptionDto,
} from "@ahmedrioueche/gympro-client";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useSubscriptionStatus = (
  mySubscription: GetSubscriptionDto | undefined
) => {
  const { t } = useTranslation();

  const statusConfig: Record<
    string,
    { color: string; bg: string; icon: string; dotColor: string }
  > = {
    active: {
      color: "text-success",
      bg: "bg-success/10",
      icon: "✓",
      dotColor: "bg-success",
    },
    trialing: {
      color: "text-warning",
      bg: "bg-warning/10",
      icon: "⏱",
      dotColor: "bg-warning",
    },
    expired: {
      color: "text-danger",
      bg: "bg-danger/10",
      icon: "✕",
      dotColor: "bg-danger",
    },
    cancelled: {
      color: "text-text-secondary",
      bg: "bg-surface-hover",
      icon: "⊘",
      dotColor: "bg-text-secondary",
    },
  };

  const isCancelled = mySubscription?.cancelAtPeriodEnd;
  const currentStatus = isCancelled
    ? "cancelled"
    : mySubscription?.status || "active";

  const status = statusConfig[currentStatus];
  const isFree = mySubscription?.plan?.level === "free";
  const start = mySubscription
    ? new Date(mySubscription.startDate)
    : new Date();

  // Calculate time remaining until current period ends
  const timeRemaining = useMemo(() => {
    if (!mySubscription) return null;

    // Always use currentPeriodEnd - this shows when the current billing period ends
    // Works for: active subscriptions, cancelled (with cancelAtPeriodEnd), and trials
    const targetDate = mySubscription.currentPeriodEnd;

    if (!targetDate) return null;

    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return { expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, expired: false };
  }, [mySubscription]);

  const getTimeRemainingText = () => {
    if (!timeRemaining || timeRemaining.expired)
      return t("subscription.expired");

    const { days, hours, minutes } = timeRemaining;

    if (days > 7) {
      return `${days} ${t("subscription.days_left")}`;
    } else if (days > 0) {
      return `${days} ${t("subscription.days_left")}, ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${t("subscription.left")}`;
    } else {
      return `${minutes}m ${t("subscription.left")}`;
    }
  };

  const getUrgencyColor = () => {
    if (!timeRemaining || timeRemaining.expired) return "text-danger";
    const { days } = timeRemaining;
    if (days <= 1) return "text-danger";
    if (days <= 3) return "text-warning";
    if (days <= 7) return "text-warning";
    return "text-success";
  };

  // Determine if we should show the time remaining card
  const shouldShowTimeRemaining = mySubscription?.currentPeriodEnd;

  /**
   * ✅ FIXED: Check if a plan is available for selection
   * Returns { available: boolean, reason?: string }
   */
  const isPlanAvailable = (
    targetPlan: AppPlan,
    targetBillingCycle: AppSubscriptionBillingCycle
  ): { available: boolean; reason?: string } => {
    // No current subscription - all plans available
    if (!mySubscription) {
      return { available: true };
    }

    const currentPlan = mySubscription.plan;
    if (!currentPlan) {
      return { available: true };
    }

    const currentBillingCycle = mySubscription.billingCycle || "monthly";

    // ❌ RULE 1: Cannot select the same plan with same billing cycle
    if (
      currentPlan.planId === targetPlan.planId &&
      currentBillingCycle === targetBillingCycle
    ) {
      return {
        available: false,
        reason: "already_subscribed",
      };
    }

    // ✅ All other plans are available
    return { available: true };
  };

  return {
    status,
    currentStatus,
    isCancelled,
    isFree,
    start,
    timeRemaining,
    formattedTimeRemaining: getTimeRemainingText(),
    urgencyColor: getUrgencyColor(),
    shouldShowTimeRemaining,
    isPlanAvailable,
  };
};

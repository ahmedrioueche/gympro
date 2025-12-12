import {
  DEFAULT_TRIAL_DAYS_NUMBER,
  type GetSubscriptionDto,
} from "@ahmedrioueche/gympro-client";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface SubscriptionCardProps {
  mySubscription: GetSubscriptionDto | undefined;
}

function SubscriptionCard({ mySubscription }: SubscriptionCardProps) {
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

  const status = statusConfig[mySubscription?.status || "active"];
  const isFree = mySubscription?.plan?.level === "free";
  const isOneTime = mySubscription?.plan?.type === "oneTime";
  const start = new Date(mySubscription.startDate);
  const trialDays = mySubscription.plan.trialDays || DEFAULT_TRIAL_DAYS_NUMBER;

  // Check if it's lifetime (one-time purchase with very far future or no end date)
  const isLifetime = useMemo(() => {
    if (!isOneTime) return false;
    if (!mySubscription?.endDate) return true;

    // Check if end date is more than 50 years in the future (considered lifetime)
    const endDate = new Date(mySubscription.endDate);
    const fiftyYearsFromNow = new Date();
    fiftyYearsFromNow.setFullYear(fiftyYearsFromNow.getFullYear() + 50);

    return endDate > fiftyYearsFromNow;
  }, [isOneTime, mySubscription?.endDate]);

  // Calculate time remaining
  const timeRemaining = useMemo(() => {
    if (!mySubscription) return null;
    if (isLifetime) return null; // No time remaining for lifetime access

    let targetDate;

    if (isFree) {
      // For free/trial plans, calculate trial end date
      targetDate = new Date(start.getTime() + trialDays * 24 * 60 * 60 * 1000);
    } else if (mySubscription.status === "cancelled") {
      // For cancelled subscriptions, use the end date
      targetDate = mySubscription.endDate;
    } else if (mySubscription.endDate) {
      // For active subscriptions with endDate (like yearly), use endDate
      targetDate = mySubscription.endDate;
    } else {
      // Fallback to nextPaymentDate for recurring subscriptions without endDate
      targetDate = mySubscription.nextPaymentDate;
    }

    if (!targetDate) return null;

    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return { expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, expired: false };
  }, [mySubscription, isFree, start, trialDays, isLifetime]);

  const getTimeRemainingText = () => {
    if (isLifetime) return t("subscription.lifetime_access");
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
    if (isLifetime) return "text-success";
    if (!timeRemaining || timeRemaining.expired) return "text-danger";
    const { days } = timeRemaining;
    if (days <= 1) return "text-danger";
    if (days <= 3) return "text-warning";
    if (days <= 7) return "text-warning";
    return "text-success";
  };

  // Determine if we should show the time remaining card
  const shouldShowTimeRemaining =
    isLifetime ||
    isFree ||
    mySubscription.status === "cancelled" ||
    mySubscription.nextPaymentDate ||
    mySubscription.endDate;

  return (
    <div className="mb-10">
      {/* Subscription Info Card */}
      {mySubscription && (
        <div className="mt-4 bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Plan Header with Time Remaining */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 md:p-8 border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              {/* Left: Plan Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${status.dotColor} animate-pulse`}
                  />
                  <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">
                    {t("subscription.current_subscription")}
                  </p>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
                  {t(
                    mySubscription?.plan?.name ||
                      mySubscription?.planId ||
                      "Unknown Plan"
                  )}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${status.color} ${status.bg} border border-current/20`}
                  >
                    <span>{status.icon}</span>
                    <span>{mySubscription.status?.toUpperCase()}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    {isFree
                      ? t("subscription.trial_plan")
                      : isOneTime
                      ? t("subscription.one_time_type")
                      : t("subscription.subscription_type")}
                  </span>
                </div>
              </div>

              {/* Right: Time Remaining or Lifetime Badge */}
              {shouldShowTimeRemaining && (
                <div className="flex-shrink-0 lg:ml-6">
                  <div className="bg-surface rounded-xl p-6 border border-border shadow-sm min-w-[200px]">
                    <p className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-3 text-center">
                      {isLifetime
                        ? t("subscription.access_status")
                        : isFree
                        ? t("subscription.trial_ends_in")
                        : mySubscription.status === "cancelled"
                        ? t("subscription.access_ends_in")
                        : t("subscription.renews_in")}
                    </p>
                    <div
                      className={`text-3xl md:text-4xl font-bold ${getUrgencyColor()} text-center mb-2`}
                    >
                      {getTimeRemainingText()}
                    </div>
                    {!isLifetime && (
                      <p className="text-xs text-text-secondary text-center">
                        {isFree && mySubscription.trial?.endDate
                          ? new Date(
                              mySubscription.trial.endDate
                            ).toLocaleDateString()
                          : mySubscription.status === "cancelled" &&
                            mySubscription.endDate
                          ? new Date(
                              mySubscription.endDate
                            ).toLocaleDateString()
                          : mySubscription.endDate
                          ? new Date(
                              mySubscription.endDate
                            ).toLocaleDateString()
                          : mySubscription.nextPaymentDate
                          ? new Date(
                              mySubscription.nextPaymentDate
                            ).toLocaleDateString()
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gyms Limit/Count */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary font-medium mb-1">
                      {isFree
                        ? t("subscription.gym_limit")
                        : t("subscription.gyms_allowed")}
                    </p>
                    <p className="text-2xl font-bold text-text-primary">
                      {mySubscription.plan?.limits?.maxGyms || 1}
                    </p>
                  </div>
                </div>
              </div>

              {/* Members Limit */}
              <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary font-medium mb-1">
                      {isFree
                        ? t("subscription.member_limit")
                        : t("subscription.members_allowed")}
                    </p>
                    <p className="text-2xl font-bold text-text-primary">
                      {mySubscription.plan?.limits?.maxMembers || 50}
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing Cycle / Access Type */}
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      {isOneTime ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary font-medium mb-1">
                      {isOneTime
                        ? t("subscription.access_type")
                        : t("subscription.billing_cycle")}
                    </p>
                    <p className="text-2xl font-bold text-text-primary capitalize">
                      {isOneTime
                        ? t("subscription.lifetime_access")
                        : isFree
                        ? t("subscription.trial_plan")
                        : mySubscription.billingCycle || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Gyms / Start Date */}
              <div className="bg-success/5 border border-success/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary font-medium mb-1">
                      {t("subscription.started_on")}
                    </p>
                    <p className="text-2xl font-bold text-text-primary">
                      {new Date(mySubscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Dates Footer */}
          {!isFree &&
            (mySubscription.startDate ||
              (mySubscription.endDate && !isLifetime) ||
              mySubscription.nextPaymentDate) && (
              <div className="border-t border-border bg-background/30 px-6 md:px-8 py-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {mySubscription.startDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary">
                        {t("subscription.started_on")}:
                      </span>
                      <span className="font-semibold text-text-primary">
                        {new Date(
                          mySubscription.startDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {mySubscription.endDate && !isLifetime && (
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary">
                        {mySubscription.status === "cancelled"
                          ? t("subscription.ends_on")
                          : t("subscription.valid_until")}
                        :
                      </span>
                      <span className="font-semibold text-text-primary">
                        {new Date(mySubscription.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {!isFree && !isOneTime && mySubscription.nextPaymentDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary">
                        {t("subscription.next_payment")}:
                      </span>
                      <span className="font-semibold text-text-primary">
                        {new Date(
                          mySubscription.nextPaymentDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default SubscriptionCard;

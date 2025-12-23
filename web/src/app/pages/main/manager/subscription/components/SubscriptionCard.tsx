import {
  type AppPlan,
  type GetSubscriptionDto,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import {
  useCancelPendingChange,
  useReactivateSubscription,
} from "../../../../../../hooks/queries/useSubscription";
import { useSubscriptionStatus } from "../../../../../../hooks/useSubscriptionStatus";
import { useModalStore } from "../../../../../../store/modal";

interface SubscriptionCardProps {
  mySubscription: GetSubscriptionDto | undefined;
  plans: AppPlan[];
}

function SubscriptionCard({ mySubscription, plans }: SubscriptionCardProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const {
    status,
    isCancelled,
    isFree,
    start,
    formattedTimeRemaining,
    urgencyColor,
    shouldShowTimeRemaining,
  } = useSubscriptionStatus(mySubscription);

  const { mutate: reactivate, isPending: isReactivating } =
    useReactivateSubscription();

  const { mutate: cancelPendingChange, isPending: isCancellingChange } =
    useCancelPendingChange();

  const handleCancelPending = () => {
    openModal("confirm", {
      title: t("plans.confirm_cancel_request_title"),
      text: t("plans.confirm_cancel_request_text"),
      confirmVariant: "danger",
      onConfirm: () => {
        cancelPendingChange();
      },
    });
  };

  const handleReactivate = () => {
    openModal("confirm", {
      title: t("confirm.reactivate.title"),
      text: t("confirm.reactivate.text", {
        date: mySubscription?.currentPeriodEnd
          ? new Date(mySubscription.currentPeriodEnd).toLocaleDateString()
          : "",
      }),
      confirmVariant: "primary",
      onConfirm: () => {
        reactivate();
      },
    });
  };

  const getPlanNameById = (planId: string) => {
    const plan = plans.find((plan) => plan.planId === planId);
    return plan?.name;
  };

  return (
    <div className="mb-10">
      {/* Subscription Info Card */}
      {mySubscription && (
        <div className="mt-4 bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Pending Change Banner */}
          {mySubscription.pendingPlanId &&
            mySubscription.pendingChangeEffectiveDate && (
              <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-3">
                  <div className="text-amber-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-500 text-sm">
                      {t("plans.switch_plan")}
                    </h4>
                    <p className="text-sm text-text-secondary">
                      {mySubscription.pendingBillingCycle ===
                      mySubscription.billingCycle
                        ? t("plans.pending_downgrade", {
                            plan: getPlanNameById(mySubscription.pendingPlanId),
                            date: new Date(
                              mySubscription.pendingChangeEffectiveDate
                            ).toLocaleDateString(),
                          })
                        : t("plans.pending_switch", {
                            cycle: mySubscription.pendingBillingCycle,
                            date: new Date(
                              mySubscription.pendingChangeEffectiveDate
                            ).toLocaleDateString(),
                          })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelPending}
                  disabled={isCancellingChange}
                  className="px-3 py-1.5 text-xs sm:text-sm font-bold text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors whitespace-nowrap"
                >
                  {isCancellingChange
                    ? t("plans.processing")
                    : t("plans.cancel_request")}
                </button>
              </div>
            )}

          {/* Cancellation Banner */}
          {isCancelled && mySubscription.currentPeriodEnd && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-3">
                <div className="text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-red-500 text-sm">
                    {t("subscription.cancelled_subscription")}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {t("subscription.access_ends_on")}:{" "}
                    {new Date(
                      mySubscription.currentPeriodEnd
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleReactivate}
                disabled={isReactivating}
                className="px-3 py-1.5 text-xs sm:text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
              >
                {isReactivating ? (
                  <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.433l-.31-.31a7 7 0 00-11.712 3.138.75.75 0 001.449.39 5.5 5.5 0 019.201-2.466l.312.312H11.75a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {t("subscription.reactivate_subscription")}
              </button>
            </div>
          )}
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
                  {mySubscription?.plan?.name || mySubscription?.planId}
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
                      : t("subscription.subscription_type")}
                  </span>
                </div>
              </div>

              {/* Right: Time Remaining or Lifetime Badge */}
              {shouldShowTimeRemaining && (
                <div className="flex-shrink-0 lg:ml-6">
                  <div className="bg-surface rounded-xl p-6 border border-border shadow-sm min-w-[200px]">
                    <p className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-3 text-center">
                      {isFree
                        ? t("subscription.trial_ends_in")
                        : isCancelled
                        ? t("subscription.access_ends_on")
                        : t("subscription.renews_in")}
                    </p>
                    <div
                      className={`text-3xl md:text-4xl font-bold ${urgencyColor} text-center mb-2`}
                    >
                      {formattedTimeRemaining}
                    </div>
                    {mySubscription.currentPeriodEnd && (
                      <p className="text-xs text-text-secondary text-center">
                        {new Date(
                          mySubscription.currentPeriodEnd
                        ).toLocaleDateString()}
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
                      {isCancelled ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
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
                      {isCancelled
                        ? t("subscription.cancelled_on")
                        : t("subscription.billing_cycle")}
                    </p>
                    <p className="text-2xl font-bold text-text-primary capitalize">
                      {isFree
                        ? t("subscription.trial_plan")
                        : isCancelled
                        ? mySubscription.cancelledAt &&
                          new Date(
                            mySubscription.cancelledAt
                          ).toLocaleDateString()
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
                      {start.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer: Dates & Reactivate Button */}
          {!isFree &&
            (mySubscription.startDate ||
              mySubscription.currentPeriodEnd ||
              mySubscription.nextPaymentDate ||
              isCancelled) && (
              <div className="border-t border-border bg-background/30 px-6 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm justify-center md:justify-start">
                  {mySubscription.startDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary">
                        {t("subscription.started_on")}:
                      </span>
                      <span className="font-semibold text-text-primary">
                        {start.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {mySubscription.currentPeriodEnd && (
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary">
                        {isCancelled
                          ? t("subscription.access_ends_on")
                          : t("subscription.period_ends_on")}
                        :
                      </span>
                      <span className="font-semibold text-text-primary">
                        {new Date(
                          mySubscription.currentPeriodEnd
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {!isFree && mySubscription.nextPaymentDate && (
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

import {
  APP_SUBSCRIPTION_BILLING_CYCLES,
  type AppPlan,
  type AppSubscriptionBillingCycle,
} from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import {
  useAllPlans,
  useMySubscription,
  useSubscribeToPlan,
} from "../../../../../hooks/queries/usePlans";
import PlanCard from "../../../../components/PlanCard";
import SubscriptionCard from "./components/SubscriptionCard";

function SubscriptionPage() {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<AppSubscriptionBillingCycle>(
    APP_SUBSCRIPTION_BILLING_CYCLES[0]
  );

  const { data: plans = [], isLoading: plansLoading } = useAllPlans();
  const { data: mySubscription, isLoading: subLoading } = useMySubscription();
  const subscribeMutation = useSubscribeToPlan();

  const handleSelectPlan = (planId: string) => {
    subscribeMutation.mutate({ planId, billingCycle });
  };

  const isCurrentPlan = (plan: AppPlan) => {
    return (
      mySubscription.plan.planId === plan.planId &&
      mySubscription.billingCycle === billingCycle
    );
  };

  // Filter and sort plans by order
  const filteredPlans = plans
    .filter((plan: any) => {
      // Filter by billing cycle
      if (billingCycle === "oneTime") {
        if (plan.type !== "oneTime") return false;
      } else {
        if (plan.type !== "subscription") return false;
      }

      // Don't show free plan (trial only)
      if (plan.level === "free") return false;

      return true;
    })
    .sort((a: any, b: any) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });

  if (plansLoading || subLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="relative mb-12 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md flex-shrink-0">
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-1">
                {t("subscriptions.title")}
              </h1>
              <p className="text-text-secondary text-sm md:text-base">
                {t("subscriptions.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {mySubscription && mySubscription?.planId && mySubscription?.plan && (
          <SubscriptionCard mySubscription={mySubscription} />
        )}

        {/* Billing Cycle Filter */}
        <div className="flex justify-center mb-12">
          <div className="bg-surface/80 backdrop-blur-md border-2 border-border rounded-2xl p-2 inline-flex shadow-xl">
            <button
              onClick={() =>
                setBillingCycle(APP_SUBSCRIPTION_BILLING_CYCLES[0])
              }
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                billingCycle === APP_SUBSCRIPTION_BILLING_CYCLES[0]
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/50"
              }`}
            >
              {t("plans.monthly")}
            </button>
            <button
              onClick={() =>
                setBillingCycle(APP_SUBSCRIPTION_BILLING_CYCLES[1])
              }
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 relative ${
                billingCycle === APP_SUBSCRIPTION_BILLING_CYCLES[1]
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/50"
              }`}
            >
              {t("plans.yearly")}
              <span className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                {t("plans.save_percentage")}
              </span>
            </button>
            <button
              onClick={() =>
                setBillingCycle(APP_SUBSCRIPTION_BILLING_CYCLES[2])
              }
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                billingCycle === APP_SUBSCRIPTION_BILLING_CYCLES[2]
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/50"
              }`}
            >
              {t("plans.one_time_purchase")}
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredPlans.map((plan: any) => (
              <PlanCard
                key={plan.planId}
                plan={plan}
                isCurrentPlan={isCurrentPlan(plan)}
                billingCycle={billingCycle}
                onSelect={() => handleSelectPlan(plan.planId)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-secondary flex items-center justify-center">
              <svg
                className="w-10 h-10 text-text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-text-secondary text-lg">
              {t("subscriptions.no_plans_available")}
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-16 text-center p-8">
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">
            {t("subscriptions.footer_info")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;

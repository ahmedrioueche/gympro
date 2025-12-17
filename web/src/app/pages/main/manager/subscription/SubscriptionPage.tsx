import {
  APP_SUBSCRIPTION_BILLING_CYCLES,
  DEFAULT_CURRENCY,
  type AppPlan,
  type AppSubscriptionBillingCycle,
  type SupportedCurrency,
} from "@ahmedrioueche/gympro-client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import { 
  useCreateSubscriptionChargilyCheckout,
} from "../../../../../hooks/queries/useChargilyCheckout";
import { 
    useSubscriptionPaddleCheckout,
} from "../../../../../hooks/queries/usePaddleCheckout";
import {
  useAllPlans,
  useDowngradeSubscription,
  useMySubscription,
} from "../../../../../hooks/queries/usePlans";
import { useModalStore } from "../../../../../store/modal";
import { useUserStore } from "../../../../../store/user";
import { getPlanChangeType } from "../../../../../utils/subscription.util";
import PlanCard from "../../../../components/PlanCard";
import CancelSubscriptionModal from "./components/CancelSubscriptionModal";
import SubscriptionCard from "./components/SubscriptionCard";
import useCurrency from "../../../../../hooks/useCurrency";
import { Link } from "@tanstack/react-router";
import { handleContactSupport } from "../../../../../utils/contact";

function SubscriptionPage() {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<AppSubscriptionBillingCycle>(
    APP_SUBSCRIPTION_BILLING_CYCLES[0]
  );
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { data: plans = [], isLoading: plansLoading } = useAllPlans();
  const { data: mySubscription, isLoading: subLoading } = useMySubscription();
  
  // BOTH payment gateways available
  const chargilyCheckoutMutation = useCreateSubscriptionChargilyCheckout();
  const paddleCheckoutMutation = useSubscriptionPaddleCheckout();
  
  const downgradeSubscription = useDowngradeSubscription();
  const { openModal } = useModalStore();
  const currency = useCurrency();

  useEffect(() => {
    if (mySubscription && mySubscription.billingCycle) {
      setBillingCycle(mySubscription.billingCycle);
    }
  }, [mySubscription]);

  // Get user currency
  const isDZD = currency === "DZD";

  const handleSelectPlan = (planId: string) => {
    // Find target plan
    const targetPlan = plans.find((p: any) => p.planId === planId);
    if (!targetPlan) return;

    // Check for downgrade/switch if subscription active
    if (
      mySubscription &&
      mySubscription.plan &&
      !["cancelled", "expired"].includes(mySubscription.status)
    ) {
      const changeType = getPlanChangeType(
        mySubscription.plan.level,
        mySubscription.billingCycle || "monthly",
        targetPlan.level,
        billingCycle
      );

      const effectiveDate = mySubscription.currentPeriodEnd
        ? new Date(mySubscription.currentPeriodEnd).toLocaleDateString()
        : t("plans.billing_period_end");

      if (changeType === "downgrade" || changeType === "switch_down") {
        openModal("confirm", {
          title:
            changeType === "downgrade"
              ? t("plans.confirm_downgrade_title")
              : t("plans.confirm_switch_title"),
          text:
            changeType === "downgrade"
              ? t("plans.confirm_downgrade_text", {
                  plan: targetPlan.name,
                  date: effectiveDate,
                })
              : t("plans.confirm_switch_text", {
                  cycle: billingCycle,
                  date: effectiveDate,
                }),
          confirmVariant: "primary",
          onConfirm: () => executeDowngrade(planId, billingCycle),
        });
        return;
      } else if (changeType === "upgrade") {
        executeSubscribe(planId);
        return;
      } else if (changeType === "switch_up") {
        openModal("confirm", {
          title: t("plans.confirm_switch_title"),
          text: t("plans.confirm_switch_immediate_text", {
            cycle: billingCycle,
          }),
          confirmVariant: "primary",
          onConfirm: () => executeSubscribe(planId),
        });
        return;
      }
    }

    executeSubscribe(planId);
  };

  const executeSubscribe = (planId: string) => {
    // Use Chargily for DZD (Algeria), Paddle for international
    if (isDZD) {
      chargilyCheckoutMutation.mutate({
        planId,
        billingCycle: billingCycle,
      });
    } else {
      paddleCheckoutMutation.mutate({
        planId,
        billingCycle: billingCycle,
      });
    }
  };

  const executeDowngrade = (
    planId: string,
    billingCycle: AppSubscriptionBillingCycle
  ) => {
    downgradeSubscription.mutate({
      planId,
      billingCycle,
    });
  };

  const isCurrentPlan = (plan: AppPlan) => {
    return (
      mySubscription?.plan?.planId === plan.planId &&
      mySubscription?.billingCycle === billingCycle
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

  useEffect(() => {
    if (window.location.hash === "#plans-section") {
      const plansSection = document.getElementById("plans-section");
      if (plansSection) {
        plansSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  if (plansLoading || subLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // Check if EITHER payment gateway is processing
  const isProcessing = chargilyCheckoutMutation.isPending || paddleCheckoutMutation.isPending;

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
          <div className="mb-12">
            <SubscriptionCard mySubscription={mySubscription} plans={plans} />
          </div>
        )}

        {/* Billing Cycle Filter */}
        <div id="plans-section" className="flex justify-center mb-12">
          <div className="bg-surface/80 backdrop-blur-md border-2 border-border rounded-2xl p-2 inline-flex shadow-xl">
            <button
              onClick={() =>
                setBillingCycle(APP_SUBSCRIPTION_BILLING_CYCLES[0])
              }
              disabled={isProcessing}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
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
              disabled={isProcessing}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 relative disabled:opacity-50 disabled:cursor-not-allowed ${
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
              disabled={isProcessing}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                billingCycle === APP_SUBSCRIPTION_BILLING_CYCLES[2]
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/50"
              }`}
            >
              {t("plans.one_time_purchase")}
            </button>
          </div>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-surface rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
              <Loading />
              <p className="text-text-primary font-medium">
                {t("checkout.redirecting")}
              </p>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredPlans.map((plan: any) => (
              <PlanCard
                key={plan.planId}
                plan={plan}
                currency={currency}
                isCurrentPlan={isCurrentPlan(plan)}
                billingCycle={billingCycle}
                onSelect={() => handleSelectPlan(plan.planId)}
                currentSubscription={mySubscription}
                disabled={isProcessing}
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

        {mySubscription && mySubscription?.planId && mySubscription?.plan && (
          <div className="flex items-center justify-center">
            {/* Cancel Button */}
            {mySubscription.status === "active" &&
              !mySubscription.cancelAtPeriodEnd &&
              mySubscription.plan?.level !== "free" &&
              mySubscription.plan?.type === "subscription" && (
                <div className="flex justify-end mt-4 px-2">
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    disabled={isProcessing}
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-danger hover:underline transition-colors px-4 py-2 rounded-lg hover:bg-danger/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    {t("subscription.cancel_subscription")}
                  </button>
                </div>
              )}
          </div>
        )}

        <CancelSubscriptionModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          subscriptionEndDate={
            mySubscription?.currentPeriodEnd
              ? new Date(mySubscription.currentPeriodEnd)
              : undefined
          }
        />

        {/* Footer Info */}
        <div className="flex flex-row justify-center items-center gap-1 text-center p-8">
          <p className="text-text-secondary text-sm">
            {t("subscriptions.footer_info").split("\n")[0]}
          </p>
          <button 
            onClick={() => handleContactSupport(t)} 
            className="text-text-secondary text-sm underline hover:text-text-primary transition-colors"
          >
            {t("subscriptions.footer_info").split("\n")[1]}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
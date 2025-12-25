import type {
  AppPlan,
  AppSubscriptionBillingCycle,
  SupportedCurrency,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import PlanCard from "../../../../../components/PlanCard";

interface PlansGridProps {
  plans: any[];
  currency: SupportedCurrency;
  isCurrentPlan: (plan: AppPlan) => boolean;
  billingCycle: AppSubscriptionBillingCycle;
  onSelect: (planId: string) => void;
  currentSubscription: any;
  isProcessing: boolean;
}

function PlansGrid({
  plans,
  currency,
  isCurrentPlan,
  billingCycle,
  onSelect,
  currentSubscription,
  isProcessing,
}: PlansGridProps) {
  const { t } = useTranslation();

  if (plans.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {plans.map((plan: any) => (
        <PlanCard
          key={plan.planId}
          plan={plan}
          currency={currency}
          isCurrentPlan={isCurrentPlan(plan)}
          billingCycle={billingCycle}
          onSelect={() => onSelect(plan.planId)}
          currentSubscription={currentSubscription}
          disabled={isProcessing}
        />
      ))}
    </div>
  );
}

export default PlansGrid;

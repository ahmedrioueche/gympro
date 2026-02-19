import {
  type AppPlan,
  type AppSubscriptionBillingCycle,
  type SupportedCurrency,
} from "@ahmedrioueche/gympro-client";
import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../../components/ui/NoData";
import PlanCard from "../../../../../components/cards/PlanCard";

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
      <NoData title={t("subscriptions.no_plans_available")} icon={CreditCard} />
    );
  }

  const gridClass =
    plans.length === 1
      ? "grid-cols-1 max-w-md mx-auto"
      : plans.length === 2
        ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${gridClass} gap-8 mb-12`}>
      {plans.map((plan: any, index: number) => {
        const previousPlan = index > 0 ? plans[index - 1] : null;
        const previousPlanName = previousPlan?.name || "";

        // Accumulate ALL packages from all preceding plans
        const cumulativePreviousPackages = plans
          .slice(0, index)
          .flatMap((p: any) =>
            p.publicFeaturePackages?.length > 0
              ? p.publicFeaturePackages
              : p.featurePackages || [],
          );

        return (
          <PlanCard
            key={plan.planId}
            plan={plan}
            currency={currency}
            isCurrentPlan={isCurrentPlan(plan)}
            billingCycle={billingCycle}
            onSelect={() => onSelect(plan.planId)}
            currentSubscription={currentSubscription}
            disabled={isProcessing}
            previousPlanName={previousPlanName}
            previousPlanPackages={cumulativePreviousPackages}
          />
        );
      })}
    </div>
  );
}

export default PlansGrid;

import {
  APP_SUBSCRIPTION_BILLING_CYCLES,
  type AppSubscriptionBillingCycle,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

interface BillingCycleToggleProps {
  billingCycle: AppSubscriptionBillingCycle;
  setBillingCycle: (cycle: AppSubscriptionBillingCycle) => void;
  isProcessing: boolean;
}

function BillingCycleToggle({
  billingCycle,
  setBillingCycle,
  isProcessing,
}: BillingCycleToggleProps) {
  const { t } = useTranslation();

  return (
    <div id="plans-section" className="flex justify-center mb-12">
      <div className="bg-surface/80 backdrop-blur-md border-2 border-border rounded-2xl p-2 inline-flex shadow-xl">
        <button
          onClick={() => setBillingCycle(APP_SUBSCRIPTION_BILLING_CYCLES[0])}
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
          onClick={() => setBillingCycle(APP_SUBSCRIPTION_BILLING_CYCLES[1])}
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
      </div>
    </div>
  );
}

export default BillingCycleToggle;

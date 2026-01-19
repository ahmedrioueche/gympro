import {
  APP_SUBSCRIPTION_BILLING_CYCLES,
  type AppSubscriptionBillingCycle,
} from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import Loading from "../../../../../components/ui/Loading";
import {
  useAllPlans,
  useMySubscription,
} from "../../../../../hooks/queries/useSubscription";
import useCurrency from "../../../../../hooks/useCurrency";
import BillingCycleToggle from "./components/BillingCycleToggle";
import CancelSubscriptionButton from "./components/CancelSubscriptionButton";
import CancelSubscriptionModal from "./components/CancelSubscriptionModal";
import PlansGrid from "./components/PlansGrid";
import ProcessingOverlay from "./components/ProcessingOverlay";
import SubscriptionCard from "./components/SubscriptionCard";
import SubscriptionFooter from "./components/SubscriptionFooter";
import SubscriptionHeader from "./components/SubscriptionHeader";
import { useScrollToPlans } from "./hooks/useScrollToPlans";
import { useSubscriptionLogic } from "./hooks/useSubscriptionLogic";

function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<AppSubscriptionBillingCycle>(
    APP_SUBSCRIPTION_BILLING_CYCLES[0]
  );
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { data: plans = [], isLoading: plansLoading } = useAllPlans();
  const { data: mySubscription, isLoading: subLoading } = useMySubscription();
  const currency = useCurrency();

  const { handleSelectPlan, isProcessing, isCurrentPlan, filteredPlans } =
    useSubscriptionLogic({
      plans,
      mySubscription,
      billingCycle,
      currency,
    });

  useScrollToPlans();

  if (plansLoading || subLoading) {
    return (
      <div>
        <SubscriptionHeader mySubscription={mySubscription} />
        <Loading />
      </div>
    );
  }

  return (
    <div>
      {/* Main Header */}
      <SubscriptionHeader mySubscription={mySubscription} />

      {/* Current Subscription Card */}
      {mySubscription && mySubscription?.planId && mySubscription?.plan && (
        <div className="mb-12">
          <SubscriptionCard mySubscription={mySubscription} plans={plans} />
        </div>
      )}

      {/* Billing Cycle Filter */}
      <BillingCycleToggle
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
        isProcessing={isProcessing}
      />

      {/* Processing Overlay */}
      {isProcessing && <ProcessingOverlay />}

      {/* Plans Grid */}
      <PlansGrid
        plans={filteredPlans}
        currency={currency}
        isCurrentPlan={isCurrentPlan}
        billingCycle={billingCycle}
        onSelect={handleSelectPlan}
        currentSubscription={mySubscription}
        isProcessing={isProcessing}
      />

      {/* Cancel Subscription Button */}
      {mySubscription && mySubscription?.planId && mySubscription?.plan && (
        <CancelSubscriptionButton
          subscription={mySubscription}
          onCancel={() => setIsCancelModalOpen(true)}
          isProcessing={isProcessing}
        />
      )}

      {/* Cancel Subscription Modal */}
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
      <SubscriptionFooter />
    </div>
  );
}

export default SubscriptionPage;

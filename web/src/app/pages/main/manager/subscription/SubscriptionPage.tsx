import {
  APP_SUBSCRIPTION_BILLING_CYCLES,
  type AppSubscriptionBillingCycle,
} from "@ahmedrioueche/gympro-client";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import { useChargilyCheckoutStatus } from "../../../../../hooks/queries/useChargilyCheckout";
import { usePaddleTransactionStatus } from "../../../../../hooks/queries/usePaddleCheckout";
import {
  useAllPlans,
  useMySubscription,
} from "../../../../../hooks/queries/useSubscription";
import useCurrency from "../../../../../hooks/useCurrency";
import { useModalStore } from "../../../../../store/modal";
import BillingCycleToggle from "./components/BillingCycleToggle";
import CancelSubscriptionButton from "./components/CancelSubscriptionButton";
import PlansGrid from "./components/PlansGrid";
import ProcessingOverlay from "./components/ProcessingOverlay";
import SubscriptionCard from "./components/SubscriptionCard";
import SubscriptionFooter from "./components/SubscriptionFooter";
import SubscriptionHeader from "./components/SubscriptionHeader";
import { useScrollToPlans } from "./hooks/useScrollToPlans";
import { useSubscriptionLogic } from "./hooks/useSubscriptionLogic";

const verifiedTransactions = new Set<string>();

function SubscriptionPage() {
  const { t } = useTranslation();
  const searchParams = useSearch({ strict: false });
  const checkoutId = searchParams.checkout_id as string | undefined;
  const paddleTransactionId = (searchParams.gp_payment_id ||
    searchParams.paddle_txn ||
    searchParams._ptxn) as string | undefined;

  const { mutate: checkChargilyStatus } = useChargilyCheckoutStatus();
  const { mutate: checkPaddleStatus } = usePaddleTransactionStatus();

  const [billingCycle, setBillingCycle] = useState<AppSubscriptionBillingCycle>(
    APP_SUBSCRIPTION_BILLING_CYCLES[0],
  );
  const { data: plans = [], isLoading: plansLoading } = useAllPlans();
  const {
    data: mySubscription,
    isLoading: subLoading,
    refetch: refetchSubscription,
  } = useMySubscription();
  const currency = useCurrency();
  const { openModal } = useModalStore();

  useEffect(() => {
    const rawParams = new URLSearchParams(window.location.search);
    const txn =
      checkoutId ||
      paddleTransactionId ||
      rawParams.get("checkout_id") ||
      rawParams.get("paddle_txn") ||
      rawParams.get("gp_payment_id");

    if (!txn || verifiedTransactions.has(txn)) return;

    verifiedTransactions.add(txn);

    // Strip URL query params synchronously to prevent loops on re-renders
    try {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    } catch {}

    if (checkoutId || rawParams.get("checkout_id")) {
      checkChargilyStatus(txn, {
        onSuccess: () => {
          toast.success(
            t(
              "payment.success.confirmed_title",
              "Subscription activated successfully!",
            ),
          );
          refetchSubscription();
        },
      });
    } else {
      checkPaddleStatus(txn, {
        onSuccess: () => {
          toast.success(
            t(
              "payment.success.confirmed_title",
              "Subscription activated successfully!",
            ),
          );
          refetchSubscription();
        },
      });
    }
  }, []);

  const { handleSelectPlan, isProcessing, isCurrentPlan, filteredPlans } =
    useSubscriptionLogic({
      plans,
      mySubscription,
      billingCycle,
      currency,
    });

  useScrollToPlans();

  // Only show full loading spinner on initial fetch when no data is present yet
  if ((plansLoading && plans.length === 0) || (subLoading && !mySubscription)) {
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
          onCancel={() =>
            openModal("cancel_subscription", {
              subscriptionEndDate: mySubscription?.currentPeriodEnd
                ? new Date(mySubscription.currentPeriodEnd)
                : undefined,
            })
          }
          isProcessing={isProcessing}
        />
      )}

      {/* Footer Info */}
      <SubscriptionFooter />
    </div>
  );
}

export default SubscriptionPage;

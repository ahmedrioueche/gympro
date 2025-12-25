import type {
  AppPlan,
  AppSubscriptionBillingCycle,
  GetSubscriptionDto,
} from "@ahmedrioueche/gympro-client";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useApplyChargilyUpgrade,
  useCreateSubscriptionChargilyCheckout,
  usePreviewChargilyUpgrade,
} from "../../../../../../hooks/queries/useChargilyCheckout";
import {
  useApplyPaddleUpgrade,
  usePreviewPaddleUpgrade,
  useSubscriptionPaddleCheckout,
} from "../../../../../../hooks/queries/usePaddleCheckout";
import {
  useDowngradeSubscription,
  useMySubscription,
} from "../../../../../../hooks/queries/useSubscription";
import { useModalStore } from "../../../../../../store/modal";
import { getPlanChangeType } from "../utils/subscription.util";

interface UseSubscriptionLogicProps {
  plans: AppPlan[];
  mySubscription: GetSubscriptionDto;
  billingCycle: AppSubscriptionBillingCycle;
  currency: string;
}

export function useSubscriptionLogic({
  plans,
  mySubscription,
  billingCycle,
  currency,
}: UseSubscriptionLogicProps) {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModalStore();
  const { refetch: refetchSubscription } = useMySubscription();

  // Payment gateways
  const chargilyCheckoutMutation = useCreateSubscriptionChargilyCheckout();
  const paddleCheckoutMutation = useSubscriptionPaddleCheckout();
  const downgradeSubscription = useDowngradeSubscription();

  // Preview upgrade mutations
  const previewPaddleUpgradeMutation = usePreviewPaddleUpgrade({
    onSuccess: (data) => {
      const targetPlan = plans.find(
        (p: any) => p.planId === data.target_plan?.planId
      );

      if (targetPlan) {
        openModal("upgrade_preview", {
          currentPlan: mySubscription?.plan!,
          targetPlan: targetPlan,
          previewData: data.preview,
          onConfirm: () => {
            closeModal();
            applyPaddleUpgradeMutation.mutate({
              planId: targetPlan.planId,
              billingCycle: data.billing_cycle || billingCycle,
            });
          },
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || t("errors.generic"));
    },
  });

  const previewChargilyUpgradeMutation = usePreviewChargilyUpgrade({
    onSuccess: (data) => {
      console.log({ data });
      const targetPlan = plans.find(
        (p: any) => p.planId === data.target_plan?.planId
      );

      if (targetPlan) {
        openModal("upgrade_preview", {
          currentPlan: mySubscription?.plan!,
          targetPlan: targetPlan,
          previewData: data.preview,
          onConfirm: () => {
            closeModal();
            applyChargilyUpgradeMutation.mutate({
              planId: targetPlan.planId,
              billingCycle: data.billing_cycle || billingCycle,
            });
          },
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || t("errors.generic"));
    },
  });

  // Apply upgrade mutations
  const applyPaddleUpgradeMutation = useApplyPaddleUpgrade({
    onSuccess: () => {
      setTimeout(() => refetchSubscription(), 2000);
    },
  });

  const applyChargilyUpgradeMutation = useApplyChargilyUpgrade({
    onSuccess: () => {
      setTimeout(() => refetchSubscription(), 2000);
    },
  });

  const isDZD = currency === "DZD";

  const handleSelectPlan = (planId: string) => {
    const targetPlan = plans.find((p: any) => p.planId === planId);
    if (!targetPlan) return;

    // Check for downgrade/switch if subscription active
    if (
      mySubscription &&
      mySubscription.plan &&
      !["cancelled", "expired"].includes(mySubscription.status)
    ) {
      // Get current and target prices
      const currentPrice =
        mySubscription.plan.pricing?.[currency]?.[
          mySubscription.billingCycle || "monthly"
        ];
      const targetPrice = targetPlan.pricing?.[currency]?.[billingCycle];

      const changeType = getPlanChangeType(
        mySubscription.plan.level,
        mySubscription.billingCycle || "monthly",
        targetPlan.level,
        billingCycle,
        currentPrice,
        targetPrice
      );

      const effectiveDate = mySubscription.currentPeriodEnd
        ? new Date(mySubscription.currentPeriodEnd).toLocaleDateString()
        : t("plans.billing_period_end");

      // Handle downgrades
      if (changeType === "downgrade") {
        openModal("confirm", {
          title: t("plans.confirm_downgrade_title"),
          text: t("plans.confirm_downgrade_text", {
            plan: targetPlan.name,
            date: effectiveDate,
          }),
          confirmVariant: "primary",
          onConfirm: () => executeDowngrade(planId, billingCycle),
        });
        return;
      }
      // Handle upgrades
      else if (changeType === "upgrade") {
        if (mySubscription.provider === "paddle") {
          previewPaddleUpgradeMutation.mutate({ planId, billingCycle });
        } else {
          previewChargilyUpgradeMutation.mutate({ planId, billingCycle });
        }
        return;
      }
      // Handle billing cycle switch with upgrade
      else if (changeType === "switch_up") {
        if (mySubscription.provider === "paddle") {
          previewPaddleUpgradeMutation.mutate({ planId, billingCycle });
        } else {
          previewChargilyUpgradeMutation.mutate({ planId, billingCycle });
        }
        return;
      }
    }

    // New subscription
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
      // Don't show free plan (trial only)
      if (plan.level === "free") return false;
      return true;
    })
    .sort((a: any, b: any) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });

  // Check if any payment gateway is processing
  const isProcessing =
    chargilyCheckoutMutation.isPending ||
    paddleCheckoutMutation.isPending ||
    applyPaddleUpgradeMutation.isPending ||
    previewPaddleUpgradeMutation.isPending;

  return {
    handleSelectPlan,
    isProcessing,
    isCurrentPlan,
    filteredPlans,
  };
}

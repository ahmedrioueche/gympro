import {
  paddleCheckoutApi,
  type AppSubscriptionBillingCycle,
} from "@ahmedrioueche/gympro-client";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { usePaddle } from "../../context/PaddleContext";
import { getMessage, showStatusToast } from "../../utils/statusMessage";
import { useToast } from "../useToast";

interface UseCheckoutOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
}

export const usePaddleCheckout = (options?: UseCheckoutOptions) => {
  const toast = useToast();
  const { t } = useTranslation();
  const { openCheckout } = usePaddle();

  return useMutation({
    mutationFn: paddleCheckoutApi.createCheckout,
    onSuccess: (response) => {
      if (response.success && response.data) {
        openCheckout({
          checkoutUrl: response.data.checkout_url,
          transactionId: response.data.transaction_id,
        });
        options?.onSuccess?.();
      } else {
        toast.error(response.message || t("checkout.creation_failed"));
        options?.onError?.(new Error(response.message || "Checkout failed"));
      }
    },
    onError: (error: Error) => {
      toast.error(t("checkout.creation_failed"));
      options?.onError?.(error);
    },
  });
};

export const useSubscriptionPaddleCheckout = (options?: UseCheckoutOptions) => {
  const toast = useToast();
  const { t } = useTranslation();
  const { openCheckout } = usePaddle();

  return useMutation({
    mutationFn: ({
      planId,
      billingCycle,
    }: {
      planId: string;
      billingCycle?: AppSubscriptionBillingCycle;
    }) => paddleCheckoutApi.createSubscriptionCheckout(planId, billingCycle),
    onSuccess: (response) => {
      if (response.success && response.data) {
        openCheckout({
          checkoutUrl: response.data.checkout_url,
          transactionId: response.data.transaction_id,
        });
        options?.onSuccess?.();
      } else {
        options?.onError?.(new Error(response.message || "Checkout failed"));
      }
      const msg = getMessage(response, t);
      showStatusToast(msg, toast);
    },
    onError: (error: any) => {
      options?.onError?.(error);
      const msg = getMessage(error, t);
      showStatusToast(msg, toast);
    },
  });
};

/**
 * Hook to preview upgrade pricing
 */
export const usePreviewPaddleUpgrade = (options?: UseCheckoutOptions) => {
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      planId,
      billingCycle,
    }: {
      planId: string;
      billingCycle?: AppSubscriptionBillingCycle;
    }) => paddleCheckoutApi.previewUpgrade(planId, billingCycle),
    onSuccess: (response) => {
      if (response.success && response.data) {
        options?.onSuccess?.(response.data);
      } else {
        toast.error(response.message || t("upgrade.preview_failed"));
        options?.onError?.(new Error(response.message || "Preview failed"));
      }
    },
    onError: (error: any) => {
      toast.error(t("upgrade.preview_failed"));
      options?.onError?.(error);
    },
  });
};

/**
 * Hook to apply upgrade (charges immediately using stored payment method)
 */
export const useApplyPaddleUpgrade = (options?: UseCheckoutOptions) => {
  const toast = useToast();
  const { t } = useTranslation();
  const { openCheckout } = usePaddle();

  return useMutation({
    mutationFn: ({
      planId,
      billingCycle,
    }: {
      planId: string;
      billingCycle?: AppSubscriptionBillingCycle;
    }) => paddleCheckoutApi.applyUpgrade(planId, billingCycle),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Check if upgrade was applied directly (payment succeeded)
        if (response.data.upgrade_applied) {
          toast.success(t("subscriptions.upgrade_success"));
          options?.onSuccess?.(response.data);
        }
        // Payment failed - needs retry via checkout
        else if (response.data.checkout_url) {
          toast.error(t("subscriptions.payment_retry"));
          openCheckout({
            checkoutUrl: response.data.checkout_url,
            transactionId: response.data.transaction_id,
          });
          options?.onSuccess?.(response.data);
        }
      } else {
        toast.error(response.message || t("subscriptions.upgrade_failed"));
        options?.onError?.(new Error(response.message || "Upgrade failed"));
      }
    },
    onError: (error: any) => {
      toast.error(t("subscriptions.upgrade_failed"));
      options?.onError?.(error);
    },
  });
};

export const usePaddleTransactionStatus = () => {
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (transactionId: string) =>
      paddleCheckoutApi.getTransactionStatus(transactionId),
    onError: () => {
      toast.error(t("checkout.status_fetch_failed"));
    },
  });
};

import {
  chargilyCheckoutApi,
  type AppSubscriptionBillingCycle,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getMessage, showStatusToast } from "../../utils/statusMessage";
import { useToast } from "../useToast";
import { planKeys } from "./useSubscription";
import { useUserStore } from "../../store/user";

interface UseCheckoutOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
}

export const useCreateChargilyCheckout = (options?: UseCheckoutOptions) => {
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: chargilyCheckoutApi.createCheckout,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Redirect to Chargily checkout page
        chargilyCheckoutApi.redirectToCheckout(response.data.checkout_url);
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

export const useCreateSubscriptionChargilyCheckout = (
  options?: UseCheckoutOptions
) => {
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      planId,
      billingCycle,
    }: {
      planId: string;
      billingCycle?: AppSubscriptionBillingCycle;
    }) => chargilyCheckoutApi.createSubscriptionCheckout(planId, billingCycle),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Redirect to Chargily checkout page
        chargilyCheckoutApi.redirectToCheckout(response.data.checkout_url);
        options?.onSuccess?.();
      } else {
        options?.onError?.(new Error(response.message || "Checkout failed"));
        const msg = getMessage(response, t);
        showStatusToast(msg, toast);
      }
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
export const usePreviewChargilyUpgrade = (options?: UseCheckoutOptions) => {
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      planId,
      billingCycle,
    }: {
      planId: string;
      billingCycle?: AppSubscriptionBillingCycle;
    }) => chargilyCheckoutApi.previewUpgrade(planId, billingCycle),
    onSuccess: (response) => {
      if (response.success && response.data) {
        options?.onSuccess?.(response.data);
      } else {
        options?.onError?.(new Error(response.message || "Preview failed"));
        const msg = getMessage(response, t);
        showStatusToast(msg, toast);
      }
    },
    onError: (error: any) => {
      const msg = getMessage(error, t);
      showStatusToast(msg, toast);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook to apply upgrade (charges immediately using stored payment method)
 */

export const useApplyChargilyUpgrade = (options?: UseCheckoutOptions) => {
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      planId,
      billingCycle,
    }: {
      planId: string;
      billingCycle?: AppSubscriptionBillingCycle;
    }) => chargilyCheckoutApi.applyUpgrade(planId, billingCycle),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Redirect to Chargily checkout page
        chargilyCheckoutApi.redirectToCheckout(response.data.checkout_url);
        options?.onSuccess?.();
      } else {
        options?.onError?.(new Error(response.message || "Checkout failed"));
      }
      const msg = getMessage(response, t);
      showStatusToast(msg, toast);
    },
    onError: (error: any) => {
      const msg = getMessage(error, t);
      showStatusToast(msg, toast);
      options?.onError?.(error);
    },
  });
};

export const useChargilyCheckoutStatus = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (checkoutId: string) =>
      chargilyCheckoutApi.getCheckoutStatus(checkoutId),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: planKeys.mySubscription() });
      qc.invalidateQueries({ queryKey: planKeys.subscription() });
      await useUserStore.getState().fetchUser(true);
    },
    onError: () => {
      toast.error(t("checkout.status_fetch_failed"));
    },
  });
};

export const useCreateRenewalChargilyCheckout = (
  options?: UseCheckoutOptions
) => {
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      billingCycle,
    }: {
      billingCycle?: AppSubscriptionBillingCycle;
    }) => chargilyCheckoutApi.createRenewalCheckout(billingCycle),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Redirect to Chargily checkout page
        chargilyCheckoutApi.redirectToCheckout(response.data.checkout_url);
        options?.onSuccess?.();
      } else {
        options?.onError?.(new Error(response.message || "Checkout failed"));
        const msg = getMessage(response, t);
        showStatusToast(msg, toast);
      }
    },
    onError: (error: any) => {
      const msg = getMessage(error, t);
      showStatusToast(msg, toast);
      options?.onError?.(error);
    },
  });
};

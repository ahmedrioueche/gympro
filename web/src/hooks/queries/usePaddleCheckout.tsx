import {
    paddleCheckoutApi,
    type AppSubscriptionBillingCycle,
  } from "@ahmedrioueche/gympro-client";
  import { useMutation } from "@tanstack/react-query";
  import { useTranslation } from "react-i18next";
import { getMessage, showStatusToast } from "../../utils/statusMessage";
import { useToast } from "../useToast";

  interface UseCheckoutOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
  
  export const usePaddleCheckout = (options?: UseCheckoutOptions) => {
    const toast = useToast();
    const { t } = useTranslation();
  
    return useMutation({
      mutationFn: paddleCheckoutApi.createCheckout,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Redirect to Paddle checkout page
          paddleCheckoutApi.redirectToCheckout(response.data.checkout_url);
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
          // Redirect to Paddle checkout page
          paddleCheckoutApi.redirectToCheckout(response.data.checkout_url);
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
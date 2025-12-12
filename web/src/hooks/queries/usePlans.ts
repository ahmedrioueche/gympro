import {
  appSubscriptionsApi,
  type AppSubscriptionBillingCycle,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const planKeys = {
  all: ["plans"] as const,
  list: () => [...planKeys.all, "list"] as const,
  subscription: () => [...planKeys.all, "subscription"] as const,
  mySubscription: () => [...planKeys.all, "my-subscription"] as const,
};

export const useAllPlans = () => {
  return useQuery({
    queryKey: planKeys.subscription(),
    queryFn: async () => {
      const res = await appSubscriptionsApi.getAllPlans();
      // Ensure we never return undefined to React Query
      return res.data ?? [];
    },
  });
};

export const useMySubscription = () => {
  return useQuery({
    queryKey: planKeys.mySubscription(),
    queryFn: async () => {
      const res = await appSubscriptionsApi.getMySubscription();
      // Return null when there's no subscription, but never undefined
      return typeof res.data === "undefined" ? null : res.data;
    },
  });
};

export const useSubscribeToPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      planId,
      billingCycle,
    }: {
      planId: string;
      billingCycle: AppSubscriptionBillingCycle;
    }) => {
      const res = await appSubscriptionsApi.subscribeToPlan(planId, {
        billingCycle,
      });
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: planKeys.mySubscription() });
      qc.invalidateQueries({ queryKey: planKeys.subscription() });
    },
  });
};

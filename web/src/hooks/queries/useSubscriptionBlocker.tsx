import { appSubscriptionsApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const blockerKeys = {
  all: ["blocker"] as const,
  config: () => [...blockerKeys.all, "config"] as const,
};

export const useSubscriptionBlockerQuery = () => {
  return useQuery({
    queryKey: blockerKeys.config(),
    queryFn: async () => {
      const res = await appSubscriptionsApi.getBlockConfig();
      // Return null when there's no blocker config, but never undefined
      return typeof res.data === "undefined" ? null : res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Always refetch on mount
  });
};

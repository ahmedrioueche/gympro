import { subscriptionApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const gymSubscriptionKeys = {
  all: ["gymSubscriptionTypes"] as const,
  list: (gymId: string) => [...gymSubscriptionKeys.all, gymId] as const,
};

/**
 * Hook to fetch subscription plans for a specific gym ID.
 * Useful for public views or discovery pages where currentGym is not set.
 */
export function useGymSubscriptionTypes(gymId: string) {
  return useQuery({
    queryKey: gymSubscriptionKeys.list(gymId),
    queryFn: async () => {
      const response = await subscriptionApi.getSubscriptionTypes(gymId);
      return response.data || [];
    },
    enabled: !!gymId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

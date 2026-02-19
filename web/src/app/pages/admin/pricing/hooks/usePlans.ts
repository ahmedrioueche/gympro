import { appSubscriptionsApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export function usePlans() {
  const {
    data: plans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminPlans"],
    queryFn: async () => {
      const res = await appSubscriptionsApi.getAllPlans(true);
      return Array.isArray(res) ? res : (res as any).data;
    },
  });

  return {
    plans,
    isLoading,
    error,
  };
}

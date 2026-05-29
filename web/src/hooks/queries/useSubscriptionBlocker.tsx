import { appSubscriptionsApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../../store/user";

export const blockerKeys = {
  all: ["blocker"] as const,
  config: () => [...blockerKeys.all, "config"] as const,
};

export const useSubscriptionBlockerQuery = () => {
  const isLanding = window.location.pathname.startsWith("/landing");
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: blockerKeys.config(),
    queryFn: async () => {
      const res = await appSubscriptionsApi.getBlockConfig();
      // Return null when there's no blocker config, but never undefined
      return typeof res.data === "undefined" ? null : res.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !isLanding && isAuthenticated,
  });
};

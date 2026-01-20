import { coachApi, type CoachClient } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useActiveClients = (enabled = true) => {
  return useQuery<CoachClient[]>({
    queryKey: ["coach", "clients"],
    queryFn: async () => {
      const response = await coachApi.getActiveClients();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data ?? [];
    },
    enabled,
  });
};

import { coachApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useActiveClients = () => {
  return useQuery({
    queryKey: ["coach", "clients"],
    queryFn: async () => {
      const response = await coachApi.getActiveClients();
      return response.data;
    },
  });
};

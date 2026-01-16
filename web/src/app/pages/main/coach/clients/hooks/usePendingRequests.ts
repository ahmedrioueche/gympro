import { coachApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const usePendingRequests = () => {
  return useQuery({
    queryKey: ["coach", "requests", "pending"],
    queryFn: async () => {
      const response = await coachApi.getPendingRequests();
      return response.data;
    },
  });
};

import {
  coachApi,
  type CoachRequestWithDetails,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useSentRequests = () => {
  return useQuery<CoachRequestWithDetails[]>({
    queryKey: ["coach", "requests", "sent"],
    queryFn: async () => {
      const response = await coachApi.getSentRequests();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch sent requests");
      }
      return response.data;
    },
  });
};

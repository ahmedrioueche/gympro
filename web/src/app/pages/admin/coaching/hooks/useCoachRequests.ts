import { adminApi, type User } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useCoachRequests = () => {
  return useQuery<User[], Error>({
    queryKey: ["coachRequests"],
    queryFn: async () => {
      const response = await adminApi.getCoachRequests();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch coach requests");
      }
      return response.data;
    },
  });
};

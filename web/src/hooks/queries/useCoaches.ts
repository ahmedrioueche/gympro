import {
  coachApi,
  type CoachProfile,
  type CoachQueryDto,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useNearbyCoaches = (query?: CoachQueryDto) => {
  return useQuery({
    queryKey: ["coaches", "nearby", query],
    queryFn: async () => {
      const response = await coachApi.getNearbyCoaches(query);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data as CoachProfile[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

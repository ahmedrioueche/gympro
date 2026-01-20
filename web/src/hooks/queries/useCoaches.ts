import {
  coachApi,
  type CoachProfile,
  type CoachQueryDto,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useNearbyCoaches = (query?: CoachQueryDto, enabled = true) => {
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
    enabled,
  });
};

export const useCoachClients = (enabled = true) => {
  return useQuery({
    queryKey: ["coach", "clients"],
    queryFn: async () => {
      const response = await coachApi.getActiveClients();
      return response;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};

export const useCoachAnalytics = () => {
  return useQuery({
    queryKey: ["coach", "analytics"],
    queryFn: async () => {
      const response = await coachApi.getAnalytics();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

import { gymCoachApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useGymStore } from "../../../../../../../store/gym";

export const useGymCoachAnalytics = () => {
  const { currentGym } = useGymStore();

  return useQuery({
    queryKey: ["gym-coach", "analytics", currentGym?._id],
    queryFn: async () => {
      if (!currentGym?._id) return null;
      const response = await gymCoachApi.getGymCoachAnalytics(currentGym._id);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    enabled: !!currentGym?._id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

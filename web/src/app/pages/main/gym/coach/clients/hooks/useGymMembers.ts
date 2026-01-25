import { gymCoachApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useGymStore } from "../../../../../../../store/gym";

export function useGymMembers() {
  const { currentGym } = useGymStore();

  return useQuery({
    queryKey: ["gym-members-for-coach", currentGym?._id],
    queryFn: async () => {
      if (!currentGym?._id) return [];
      const response = await gymCoachApi.getGymMembersForCoach(currentGym._id);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: !!currentGym?._id,
  });
}

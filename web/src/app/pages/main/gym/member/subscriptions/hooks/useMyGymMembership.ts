import { membershipApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useGymStore } from "../../../../../../../store/gym";

export const useMyGymMembership = () => {
  const { currentGym } = useGymStore();
  const gymId = currentGym?._id;

  console.log("useMyGymMembership: currentGym", currentGym);
  console.log("useMyGymMembership: gymId", gymId);

  return useQuery({
    queryKey: ["myGymMembership", gymId],
    queryFn: async () => {
      console.log("useMyGymMembership: Fetching for gymId", gymId);
      if (!gymId) return null;
      const response = await membershipApi.getMyMembershipByGym(gymId);
      console.log("useMyGymMembership: Response", response.data);
      return response.data;
    },
    enabled: !!gymId,
  });
};

import { membershipApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useGymStore } from "../../../../../../../store/gym";

export const useMyGymMembership = () => {
  const { currentGym } = useGymStore();
  const gymId = currentGym?._id;

  console.log("useMyGymMembership: currentGym", currentGym);
  console.log("useMyGymMembership: gymId", gymId);

  return useQuery<{
    membership: any;
    memberships: any[];
    history: any[];
  } | null>({
    queryKey: ["myGymMembership", gymId],
    queryFn: async () => {
      if (!gymId) return null;
      try {
        const response = await (membershipApi.getMyMembershipByGym(
          gymId
        ) as any);
        console.log("useMyGymMembership: API Response", response);
        if (!response.success || !response.data) {
          console.warn(
            "useMyGymMembership: Success=false or missing data",
            response
          );
          return null;
        }
        return response.data;
      } catch (error) {
        console.error("useMyGymMembership: Error fetching", error);
        return null;
      }
    },
    enabled: !!gymId,
  });
};

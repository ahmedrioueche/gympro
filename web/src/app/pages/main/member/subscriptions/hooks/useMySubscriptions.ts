import { membershipApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useMySubscriptions = () => {
  return useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: async () => {
      const response = await membershipApi.getMyMemberships();
      return response;
    },
  });
};

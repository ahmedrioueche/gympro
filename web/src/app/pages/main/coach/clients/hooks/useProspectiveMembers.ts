import {
  coachApi,
  type ProspectiveMembersQueryDto,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useProspectiveMembers = (query?: ProspectiveMembersQueryDto) => {
  return useQuery({
    queryKey: ["coach", "prospective-members", query],
    queryFn: async () => {
      const response = await coachApi.getProspectiveMembers(query);
      return response.data;
    },
  });
};

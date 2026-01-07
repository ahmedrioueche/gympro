import {
  membershipApi,
  type MemberProfileView,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const memberProfileKeys = {
  all: ["memberProfile"] as const,
  detail: (gymId?: string, membershipId?: string) =>
    [...memberProfileKeys.all, gymId, membershipId] as const,
};

export const useMemberProfile = (gymId?: string, membershipId?: string) => {
  return useQuery<MemberProfileView | null>({
    queryKey: memberProfileKeys.detail(gymId, membershipId),
    queryFn: async () => {
      if (!gymId || !membershipId) return null;
      const response = await membershipApi.getMemberProfile(
        gymId,
        membershipId
      );
      return response.data ?? null;
    },
    enabled: !!gymId && !!membershipId,
  });
};

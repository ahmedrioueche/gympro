import {
  membershipApi,
  usersApi,
  type MemberProfileView,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const memberProfileKeys = {
  all: ["memberProfile"] as const,
  detail: (gymId?: string, membershipId?: string, memberId?: string) =>
    [...memberProfileKeys.all, gymId, membershipId, memberId] as const,
};

export const useMemberProfile = (
  gymId?: string,
  membershipId?: string,
  memberId?: string,
) => {
  return useQuery<MemberProfileView | null>({
    queryKey: memberProfileKeys.detail(gymId, membershipId, memberId),
    queryFn: async () => {
      // 1. Try fetching full member profile via membership
      if (gymId && membershipId) {
        const response = await membershipApi.getMemberProfile(
          gymId,
          membershipId,
        );
        return response.data ?? null;
      }

      // 2. Fallback: Fetch user details directly
      if (memberId) {
        const response = await usersApi.getUser(memberId);
        if (!response.data) return null;

        // Construct a partial view (mocking missing membership data)
        return {
          user: response.data,
          membership: undefined as any, // Type assertion since it's required in view
          payments: [],
        } as MemberProfileView;
      }

      return null;
    },
    enabled: (!!gymId && !!membershipId) || !!memberId,
  });
};

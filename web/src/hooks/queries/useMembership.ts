import { type ApiResponse, membershipApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const membershipKeys = {
  all: ["membership"] as const,
  lists: () => [...membershipKeys.all, "list"] as const,
  byGym: (gymId: string) => [...membershipKeys.all, "gym", gymId] as const,
};

/**
 * Hook to fetch current user's membership for a specific gym
 */
export function useMyMembershipInGym(gymId: string) {
  return useQuery<ApiResponse<{ membership: any; history: any[] }>, Error>({
    queryKey: membershipKeys.byGym(gymId),
    queryFn: () => membershipApi.getMyMembershipByGym(gymId),
    enabled: !!gymId,
  });
}

/**
 * Hook to update membership settings
 */
export function useUpdateMembershipSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gymId, settings }: { gymId: string; settings: any }) =>
      membershipApi.updateMembershipSettings(gymId, settings),
    onSuccess: (_, { gymId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: membershipKeys.byGym(gymId) });
    },
  });
}

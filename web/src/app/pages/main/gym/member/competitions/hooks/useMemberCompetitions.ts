import {
  competitionApi,
  type Competition,
  type CompetitionType,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CompetitionResult {
  data: Competition[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Hook for fetching competitions as a member
 */
export function useMemberCompetitions(
  gymId?: string,
  params: {
    search?: string;
    type?: CompetitionType;
    page?: number;
    limit?: number;
  } = {},
) {
  return useQuery<CompetitionResult>({
    queryKey: ["member-competitions", gymId, params],
    queryFn: async () => {
      if (!gymId) throw new Error("Gym ID is required");
      const response = await competitionApi.getMemberCompetitions(
        gymId,
        params,
      );
      const result = response.data as any;
      return {
        data: result?.data || [],
        total: result?.total || 0,
        page: result?.page || 1,
        limit: result?.limit || 20,
        totalPages: result?.totalPages || 1,
      };
    },
    enabled: !!gymId,
  });
}

/**
 * Hook for joining a competition
 */
export function useJoinCompetition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gymId,
      competitionId,
    }: {
      gymId: string;
      competitionId: string;
    }) => competitionApi.join(gymId, competitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-competitions"] });
    },
  });
}

/**
 * Hook for leaving a competition
 */
export function useLeaveCompetition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gymId,
      competitionId,
    }: {
      gymId: string;
      competitionId: string;
    }) => competitionApi.leave(gymId, competitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-competitions"] });
    },
  });
}

import {
  competitionApi,
  type Competition,
  type CompetitionQueryDto,
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
 * Hook for fetching competitions as a coach
 * Uses the member-friendly endpoint as coaches share the same view permissions
 */
export function useCoachCompetitions(
  gymId?: string,
  params: CompetitionQueryDto = {},
) {
  return useQuery<CompetitionResult>({
    queryKey: ["coach-competitions", gymId, params],
    queryFn: async () => {
      if (!gymId) throw new Error("Gym ID is required");
      const response = await competitionApi.getMemberCompetitions(
        gymId,
        params,
      );
      return response.data as unknown as CompetitionResult;
    },
    enabled: !!gymId,
  });
}

/**
 * Hook for coach to join a competition (if they wish to participate)
 */
export function useCoachJoinCompetition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gymId,
      competitionId,
    }: {
      gymId: string;
      competitionId: string;
    }) => competitionApi.join(gymId, competitionId),
    onSuccess: (_, { gymId }) => {
      queryClient.invalidateQueries({
        queryKey: ["coach-competitions", gymId],
      });
      queryClient.invalidateQueries({
        queryKey: ["member-competitions", gymId],
      });
    },
  });
}

/**
 * Hook for coach to leave a competition
 */
export function useCoachLeaveCompetition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gymId,
      competitionId,
    }: {
      gymId: string;
      competitionId: string;
    }) => competitionApi.leave(gymId, competitionId),
    onSuccess: (_, { gymId }) => {
      queryClient.invalidateQueries({
        queryKey: ["coach-competitions", gymId],
      });
      queryClient.invalidateQueries({
        queryKey: ["member-competitions", gymId],
      });
    },
  });
}

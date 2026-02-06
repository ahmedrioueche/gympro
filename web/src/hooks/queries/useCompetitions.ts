import {
  competitionApi,
  type Competition,
  type CompetitionQueryDto,
  type CreateCompetitionDto,
  type UpdateCompetitionDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const competitionKeys = {
  all: ["competitions"] as const,
  lists: () => [...competitionKeys.all, "list"] as const,
  list: (filters: CompetitionQueryDto & { gymId?: string }) =>
    [...competitionKeys.lists(), filters] as const,
  details: () => [...competitionKeys.all, "detail"] as const,
  detail: (id: string) => [...competitionKeys.details(), id] as const,
  participants: (id: string) =>
    [...competitionKeys.detail(id), "participants"] as const,
};

/**
 * Get participants for a competition (Manager only)
 */
export const useCompetitionParticipants = (
  gymId: string,
  competitionId: string,
) => {
  return useQuery({
    queryKey: competitionKeys.participants(competitionId),
    queryFn: async () => {
      const response = await competitionApi.getParticipants(
        gymId,
        competitionId,
      );
      return response.data;
    },
    enabled: !!gymId && !!competitionId,
  });
};

export interface CompetitionResult {
  data: Competition[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get competitions for a gym (paginated)
 */
export const useCompetitions = (
  gymId?: string,
  options: CompetitionQueryDto = {},
) => {
  return useQuery<CompetitionResult>({
    queryKey: competitionKeys.list({ ...options, gymId }),
    queryFn: async () => {
      if (!gymId) throw new Error("Gym ID is required");
      const response = await competitionApi.findAll(gymId, options);
      return response.data as unknown as CompetitionResult;
    },
    enabled: !!gymId,
  });
};

/**
 * Create a new competition
 */
export const useCreateCompetition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gymId,
      data,
    }: {
      gymId: string;
      data: CreateCompetitionDto;
    }) => competitionApi.create(gymId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: competitionKeys.lists(),
      });
    },
  });
};

/**
 * Update a competition
 */
export const useUpdateCompetition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gymId,
      id,
      data,
    }: {
      gymId: string;
      id: string;
      data: UpdateCompetitionDto;
    }) => competitionApi.update(gymId, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: competitionKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: competitionKeys.detail(variables.id),
      });
    },
  });
};

/**
 * Delete a competition
 */
export const useDeleteCompetition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gymId, id }: { gymId: string; id: string }) =>
      competitionApi.remove(gymId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: competitionKeys.lists(),
      });
    },
  });
};

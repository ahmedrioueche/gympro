import {
  gymCoachApi,
  type GymCoachAffiliation,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Queries

export const useGymCoaches = (gymId: string | undefined) => {
  return useQuery({
    queryKey: ["gym", gymId, "coaches"],
    queryFn: async () => {
      if (!gymId) return [];
      const response = await gymCoachApi.getGymCoaches(gymId);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data as GymCoachAffiliation[];
    },
    enabled: !!gymId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCoachAffiliations = () => {
  return useQuery({
    queryKey: ["coach", "affiliations"],
    queryFn: async () => {
      const response = await gymCoachApi.getCoachGyms();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data as GymCoachAffiliation[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations

export const useInviteCoach = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      gymId,
      coachId,
      message,
      isExclusive,
      commissionRate,
    }: {
      gymId: string;
      coachId: string;
      message?: string;
      isExclusive?: boolean;
      commissionRate?: number;
    }) => {
      const response = await gymCoachApi.inviteCoach(gymId, {
        coachId,
        message,
        isExclusive,
        commissionRate,
      });
      return response;
    },
    onSuccess: (response, { gymId }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["gym", gymId, "coaches"] });
      }
    },
  });
};

export const useRequestGymAffiliation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      gymId,
      message,
    }: {
      gymId: string;
      message?: string;
    }) => {
      const response = await gymCoachApi.requestGymAffiliation(gymId, {
        message,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coach", "affiliations"] });
    },
  });
};

export const useRespondToAffiliation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      affiliationId,
      accept,
      message,
    }: {
      affiliationId: string;
      accept: boolean;
      message?: string;
    }) => {
      const response = await gymCoachApi.respondToAffiliation(affiliationId, {
        accept,
        message,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym"] });
      queryClient.invalidateQueries({ queryKey: ["coach", "affiliations"] });
    },
  });
};

export const useTerminateAffiliation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (affiliationId: string) => {
      const response = await gymCoachApi.terminateAffiliation(affiliationId);
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym"] });
      queryClient.invalidateQueries({ queryKey: ["coach", "affiliations"] });
    },
  });
};

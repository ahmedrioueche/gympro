import {
  gymApi,
  type CreateGymDto,
  type Gym,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useToast } from "../useToast";

// Query Keys
export const gymKeys = {
  all: ["gyms"] as const,
  lists: () => [...gymKeys.all, "list"] as const,
  list: (filters?: any) => [...gymKeys.lists(), filters] as const,
  details: () => [...gymKeys.all, "detail"] as const,
  detail: (id: string) => [...gymKeys.details(), id] as const,
  myGyms: () => [...gymKeys.all, "my-gyms"] as const,
  memberGyms: () => [...gymKeys.all, "member"] as const,
  allMyGyms: () => [...gymKeys.all, "all-my-gyms"] as const,
};

// ============================================
// QUERIES
// ============================================

/**
 * Get all gyms
 */
export const useGyms = () => {
  return useQuery({
    queryKey: gymKeys.lists(),
    queryFn: async () => {
      const response = await gymApi.findAll();
      return response.data;
    },
  });
};

/**
 * Get a single gym by ID
 */
export const useGym = (id: string, enabled = true) => {
  return useQuery({
    queryKey: gymKeys.detail(id),
    queryFn: async () => {
      const response = await gymApi.findOne(id);
      return response.data;
    },
    enabled: enabled && !!id,
  });
};

/**
 * Get gyms owned by current user
 */
export const useMyGyms = () => {
  return useQuery({
    queryKey: gymKeys.myGyms(),
    queryFn: async () => {
      const response = await gymApi.findMyGyms();
      return response.data;
    },
  });
};

/**
 * Get gyms where current user is a member
 */
export const useMemberGyms = () => {
  return useQuery({
    queryKey: gymKeys.memberGyms(),
    queryFn: async () => {
      const response = await gymApi.findMemberGyms();
      return response.data;
    },
  });
};

/**
 * Get all gyms for current user (owned + member combined)
 * This is the recommended hook for GymSelector and similar components
 */
export const useAllMyGyms = () => {
  return useQuery({
    queryKey: gymKeys.allMyGyms(),
    queryFn: async () => {
      const response = await gymApi.findAllMyGyms();
      return response.data;
    },
  });
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new gym
 */
export const useCreateGym = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (data: CreateGymDto) => {
      const response = await gymApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all gym queries to refetch
      queryClient.invalidateQueries({ queryKey: gymKeys.all });
      success(t("create_gym.success"));
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: gymKeys.all });
      error(t("create_gym.error"));
    },
  });
};

/**
 * Update a gym
 */
export const useUpdateGym = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Gym> }) => {
      const response = await gymApi.update(id, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate specific gym and all lists
      queryClient.invalidateQueries({ queryKey: gymKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: gymKeys.lists() });
      queryClient.invalidateQueries({ queryKey: gymKeys.myGyms() });
      queryClient.invalidateQueries({ queryKey: gymKeys.allMyGyms() });
    },
  });
};

/**
 * Delete a gym
 */
export const useDeleteGym = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await gymApi.remove(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: gymKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: gymKeys.lists() });
      queryClient.invalidateQueries({ queryKey: gymKeys.myGyms() });
      queryClient.invalidateQueries({ queryKey: gymKeys.allMyGyms() });
    },
  });
};

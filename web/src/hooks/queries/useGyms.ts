import {
  gymApi,
  type CreateGymDto,
  type Gym,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../store/user";
import { useToast } from "../useToast";

// Query Keys
export const gymKeys = {
  all: ["gyms"] as const,
  lists: () => [...gymKeys.all, "list"] as const,
  list: (filters?: any) => [...gymKeys.lists(), filters] as const,
  cities: () => [...gymKeys.all, "cities"] as const,
  details: () => [...gymKeys.all, "detail"] as const,
  detail: (id: string) => [...gymKeys.details(), id] as const,
  myGyms: () => [...gymKeys.all, "my-gyms"] as const,
  memberGyms: () => [...gymKeys.all, "member"] as const,
  allMyGyms: (role?: string) => {
    const base = [...gymKeys.all, "all-my-gyms"] as const;
    if (!role) return base;
    return [...base, role] as const;
  },
};

// ============================================
// QUERIES
// ============================================

/**
 * Get all gyms
 */
export const useGyms = (
  params: {
    search?: string;
    city?: string;
    gender?: string;
    services?: string[];
    page?: number;
    limit?: number;
    excludeUserId?: string;
  } = {},
) => {
  return useQuery({
    queryKey: gymKeys.list(params),
    queryFn: async () => {
      const response = await gymApi.findAll(params);
      if (!response.success) throw new Error(response.message);
      return response.data as any; // Cast as any then back to fix inference if needed or just use the proper type
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
  const isLanding = window.location.pathname.startsWith("/landing");
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: gymKeys.myGyms(),
    queryFn: async () => {
      const response = await gymApi.findMyGyms();
      return response.data;
    },
    enabled: !isLanding && isAuthenticated,
  });
};

/**
 * Get gyms where current user is a member
 */
export const useMemberGyms = () => {
  const isLanding = window.location.pathname.startsWith("/landing");
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: gymKeys.memberGyms(),
    queryFn: async () => {
      const response = await gymApi.findMemberGyms();
      return response.data;
    },
    enabled: !isLanding && isAuthenticated,
  });
};

/**
 * Get all gyms for current user (owned + member combined)
 * This is the recommended hook for GymSelector and similar components
 * Automatically adapts based on the active dashboard role
 */
export const useAllMyGyms = () => {
  const activeDashboard = useUserStore((state) => state.activeDashboard);
  const isLanding = window.location.pathname.startsWith("/landing");
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: gymKeys.allMyGyms(activeDashboard),
    queryFn: async () => {
      // If we are in the member dashboard, only show gyms where the user is a member
      if (activeDashboard === "member") {
        const response = await gymApi.findMemberGyms();
        return response.data;
      }

      // For manager and coach dashboards, return all associated gyms (owned, member, and coach)
      const response = await gymApi.findAllMyGyms();
      return response.data;
    },
    enabled: !isLanding && isAuthenticated,
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
 * Update gym settings
 */
export const useUpdateGymSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await gymApi.updateGymSettings(id, data);
      return response;
    },
    onSuccess: (response, variables) => {
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

/**
 * Request access to a gym
 */
export const useRequestGymAccess = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { t } = useTranslation();
  const { user, fetchUser } = useUserStore();

  return useMutation({
    mutationFn: async (gymId: string) => {
      // Frontend check: Prevent sending if already pending or joined
      const membership = user?.memberships?.find((m: any) => {
        if (typeof m === "string") return false;
        const gId = typeof m.gym === "string" ? m.gym : m.gym._id;
        return gId === gymId;
      });

      if (membership && typeof membership !== "string") {
        if (membership.membershipStatus === "pending") {
          throw new Error(t("gyms.already_pending", "Request already pending"));
        }
        if (membership.membershipStatus === "active") {
          throw new Error(t("gyms.already_joined", "Already a member"));
        }
      }

      const response = await gymApi.requestAccess(gymId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: async () => {
      // Invalidate pertinent queries to reflect pending status
      queryClient.invalidateQueries({ queryKey: gymKeys.all });

      // Refresh user profile to update membership status in store
      // FORCE refresh to bypass cache
      await fetchUser(true);

      success(t("gyms.request_success", "Join request submitted!"));
    },
    onError: (err: any) => {
      error(err.message || t("gyms.request_error", "Failed to submit request"));
    },
  });
};

/**
 * Get unique cities where gyms are located
 */
export const useGymCities = () => {
  return useQuery({
    queryKey: gymKeys.cities(),
    queryFn: async () => {
      console.log("Fetching unique cities...");
      const res = await gymApi.getUniqueCities();
      if (!res.success) throw new Error(res.message);
      return res.data || [];
    },
    staleTime: 0,
    gcTime: 0,
  });
};

/**
 * Add a facility to a gym
 */
export const useAddFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gymId, data }: { gymId: string; data: any }) => {
      const response = await gymApi.addFacility(gymId, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: gymKeys.detail(variables.gymId),
      });
    },
  });
};

/**
 * Update a facility in a gym
 */
export const useUpdateFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gymId,
      facilityId,
      data,
    }: {
      gymId: string;
      facilityId: string;
      data: any;
    }) => {
      const response = await gymApi.updateFacility(gymId, facilityId, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: gymKeys.detail(variables.gymId),
      });
    },
  });
};

/**
 * Remove a facility from a gym
 */
export const useRemoveFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gymId,
      facilityId,
    }: {
      gymId: string;
      facilityId: string;
    }) => {
      const response = await gymApi.removeFacility(gymId, facilityId);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: gymKeys.detail(variables.gymId),
      });
    },
  });
};

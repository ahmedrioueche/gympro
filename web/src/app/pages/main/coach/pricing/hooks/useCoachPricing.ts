import {
  coachApi,
  type CoachPricingTier,
  type CoachPricingTierDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PRICING_QUERY_KEY = ["coach", "pricing"];

export function useCoachPricing(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PRICING_QUERY_KEY,
    queryFn: async () => {
      const response = await coachApi.getMyPricing();
      if (!response.success) {
        throw new Error(response.errorCode || "Failed to fetch pricing");
      }
      return response.data as CoachPricingTier[];
    },
    enabled: options?.enabled,
  });
}

export function useCreatePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CoachPricingTierDto) => {
      const response = await coachApi.createPricing(data);
      if (!response.success) {
        throw new Error(response.errorCode || "Failed to create pricing");
      }
      return response.data as CoachPricingTier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRICING_QUERY_KEY });
    },
  });
}

export function useUpdatePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CoachPricingTierDto>;
    }) => {
      const response = await coachApi.updatePricing(id, data);
      if (!response.success) {
        throw new Error(response.errorCode || "Failed to update pricing");
      }
      return response.data as CoachPricingTier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRICING_QUERY_KEY });
    },
  });
}

export function useDeletePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await coachApi.deletePricing(id);
      if (!response.success) {
        throw new Error(response.errorCode || "Failed to delete pricing");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRICING_QUERY_KEY });
    },
  });
}

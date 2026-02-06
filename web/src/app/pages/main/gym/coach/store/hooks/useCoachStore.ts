import { storeApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for fetching products as a coach
 * Uses the member-friendly endpoint as coaches share the same view permissions
 */
export function useCoachStore(
  gymId?: string,
  params: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  } = {},
) {
  return useQuery({
    queryKey: ["coach-store", gymId, params],
    queryFn: () => storeApi.getMemberProducts(gymId!, params),
    enabled: !!gymId,
  });
}

export function useCoachProduct(gymId?: string, id?: string) {
  return useQuery({
    queryKey: ["coach-product", gymId, id],
    queryFn: () => storeApi.getProduct(gymId!, id!),
    enabled: !!gymId && !!id,
  });
}

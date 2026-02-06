import { storeApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for fetching products as a member
 * Uses the member-friendly endpoint that doesn't require store:view permission
 */
export function useStore(
  gymId?: string,
  params: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  } = {},
) {
  return useQuery({
    queryKey: ["member-store", gymId, params],
    queryFn: () => storeApi.getMemberProducts(gymId!, params),
    enabled: !!gymId,
  });
}

export function useProduct(gymId?: string, id?: string) {
  return useQuery({
    queryKey: ["product", gymId, id],
    queryFn: () => storeApi.getProduct(gymId!, id!),
    enabled: !!gymId && !!id,
  });
}

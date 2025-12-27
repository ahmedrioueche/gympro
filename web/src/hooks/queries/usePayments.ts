import {
  appPaymentsApi,
  type AppPaymentFilterDto,
  type GetAppPaymentDto,
  type GetAppPaymentsResponseDto,
} from "@ahmedrioueche/gympro-client";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

// Query keys for cache management
export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters: AppPaymentFilterDto) =>
    [...paymentKeys.lists(), filters] as const,
  stats: () => [...paymentKeys.all, "stats"] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
};

/**
 * Hook to fetch current user's payments with filtering and pagination
 */
export function useMyPayments(
  filters: AppPaymentFilterDto = {},
  options?: Omit<
    UseQueryOptions<GetAppPaymentsResponseDto, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<GetAppPaymentsResponseDto, Error>({
    queryKey: paymentKeys.list(filters),
    queryFn: () => appPaymentsApi.getMyPayments(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

/**
 * Hook to fetch a single payment by ID
 */
export function usePaymentById(
  id: string,
  options?: Omit<
    UseQueryOptions<GetAppPaymentDto, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<GetAppPaymentDto, Error>({
    queryKey: paymentKeys.detail(id),
    queryFn: () => appPaymentsApi.getPaymentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}

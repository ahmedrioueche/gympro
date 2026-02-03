import { inventoryApi, type EquipmentItem } from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: {
    gymId?: string;
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) => [...inventoryKeys.lists(), filters] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

interface UseInventoryOptions {
  gymId?: string;
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export interface InventoryResult {
  data: EquipmentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get inventory items for a gym (paginated)
 */
export const useInventory = (options: UseInventoryOptions = {}) => {
  const {
    gymId,
    search,
    category,
    page = 1,
    limit = 12,
    enabled = true,
  } = options;

  return useQuery<InventoryResult>({
    queryKey: inventoryKeys.list({ gymId, search, category, page, limit }),
    queryFn: async () => {
      if (!gymId) throw new Error("Gym ID is required");
      const response = await inventoryApi.findAll(gymId, {
        search: search || undefined,
        category: category || undefined,
        page,
        limit,
      });
      return response as unknown as InventoryResult;
    },
    enabled: !!gymId && enabled,
  });
};

/**
 * Create a new inventory item
 */
export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gymId, data }: { gymId: string; data: any }) =>
      inventoryApi.create(gymId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.lists(),
      });
    },
  });
};

/**
 * Update an inventory item
 */
export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gymId,
      itemId,
      data,
    }: {
      gymId: string;
      itemId: string;
      data: any;
    }) => inventoryApi.update(gymId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(variables.itemId),
      });
    },
  });
};

/**
 * Delete an inventory item
 */
export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gymId, itemId }: { gymId: string; itemId: string }) =>
      inventoryApi.remove(gymId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.lists(),
      });
    },
  });
};

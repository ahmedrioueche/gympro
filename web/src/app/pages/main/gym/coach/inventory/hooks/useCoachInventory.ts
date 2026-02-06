import {
  inventoryApi,
  type EquipmentCategory,
  type EquipmentItem,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

interface InventoryResult {
  data: EquipmentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Hook for fetching inventory as a coach
 * Uses the member-friendly endpoint as coaches share the same view permissions
 */
export function useCoachInventory(options: {
  gymId?: string;
  search?: string;
  category?: EquipmentCategory | "all";
  page?: number;
  limit?: number;
}) {
  const { gymId, search, category, page = 1, limit = 12 } = options;

  return useQuery<InventoryResult>({
    queryKey: ["coach-inventory", gymId, { search, category, page, limit }],
    queryFn: async () => {
      if (!gymId) throw new Error("Gym ID is required");
      const response = await inventoryApi.findAllForMembers(gymId, {
        search: search || undefined,
        category: category === "all" ? undefined : category,
        page,
        limit,
      });
      return response as unknown as InventoryResult;
    },
    enabled: !!gymId,
  });
}

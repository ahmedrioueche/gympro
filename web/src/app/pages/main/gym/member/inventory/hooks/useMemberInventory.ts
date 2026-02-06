import { inventoryApi, type EquipmentItem } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

interface InventoryResult {
  data: EquipmentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Hook for fetching inventory as a member
 * Uses the member-friendly endpoint that doesn't require inventory:view permission
 */
export function useMemberInventory(options: {
  gymId?: string;
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const { gymId, search, category, page = 1, limit = 12 } = options;

  return useQuery<InventoryResult>({
    queryKey: ["member-inventory", gymId, { search, category, page, limit }],
    queryFn: async () => {
      if (!gymId) throw new Error("Gym ID is required");
      const response = await inventoryApi.findAllForMembers(gymId, {
        search: search || undefined,
        category: category || undefined,
        page,
        limit,
      });
      return response as unknown as InventoryResult;
    },
    enabled: !!gymId,
  });
}

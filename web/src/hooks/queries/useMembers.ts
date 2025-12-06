import { gymApi, usersApi, type User } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: (filters?: {
    page?: number;
    limit?: number;
    search?: string;
    gymId?: string;
  }) => [...memberKeys.lists(), filters] as const,
};

interface UseMembersOptions {
  gymId?: string; // If provided, fetch members for this gym
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export interface MembersResult {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get members - either all members or members for a specific gym (paginated)
 */
export const useMembers = (options: UseMembersOptions = {}) => {
  const { gymId, page = 1, limit = 12, search, enabled = true } = options;

  return useQuery<MembersResult>({
    queryKey: memberKeys.list({ page, limit, search, gymId }),
    queryFn: async ({ signal }) => {
      if (gymId) {
        // Fetch members for a specific gym (now paginated)
        const response = await gymApi.getGymMembers(gymId, {
          search: search || undefined, // Don't send empty string
          page,
          limit,
        });
        // Backend returns { data, total, page, limit, totalPages }
        const paginatedData = response.data as unknown as MembersResult;
        return paginatedData;
      } else {
        // Fetch all members (fallback - not paginated on backend yet)
        const response = await usersApi.list(
          page,
          limit,
          search,
          "member",
          signal
        );
        const users = response.data as User[];
        return {
          data: users,
          total: users.length,
          page: 1,
          limit: users.length,
          totalPages: 1,
        };
      }
    },
    enabled,
  });
};

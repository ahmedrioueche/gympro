import {
  type AdminDashboardStats,
  adminApi,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useAdminStats = () => {
  return useQuery<AdminDashboardStats>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const response = await adminApi.getDashboardStats();
      return response.data as AdminDashboardStats;
    },
  });
};

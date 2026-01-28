import { coachApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export function useGymCoachHomeData() {
  const statsQuery = useQuery({
    queryKey: ["coach-dashboard-stats"],
    queryFn: async () => {
      const response = await coachApi.getDashboardStats();
      return response.data;
    },
  });

  const activeClientsQuery = useQuery({
    queryKey: ["coach-active-clients"],
    queryFn: async () => {
      const response = await coachApi.getActiveClients();
      return response.data;
    },
  });

  const pendingRequestsQuery = useQuery({
    queryKey: ["coach-pending-requests"],
    queryFn: async () => {
      const response = await coachApi.getPendingRequests();
      return response.data;
    },
  });

  const recentActivityQuery = useQuery({
    queryKey: ["coach-recent-activity"],
    queryFn: async () => {
      const response = await coachApi.getDashboardActivity();
      return response.data;
    },
  });

  return {
    stats: statsQuery.data,
    isStatsLoading: statsQuery.isLoading,
    activeClients: activeClientsQuery.data || [],
    isActiveClientsLoading: activeClientsQuery.isLoading,
    pendingRequests: pendingRequestsQuery.data || [],
    isPendingRequestsLoading: pendingRequestsQuery.isLoading,
    recentActivity: recentActivityQuery.data || [],
    isRecentActivityLoading: recentActivityQuery.isLoading,
  };
}

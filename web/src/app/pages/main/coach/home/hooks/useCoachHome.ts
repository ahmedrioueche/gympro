import { coachApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export function useCoachHome() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["coach", "dashboard", "stats"],
    queryFn: async () => {
      try {
        const res = await coachApi.getDashboardStats();
        return res.data;
      } catch (err) {
        console.error("Error calling getDashboardStats:", err);
        throw err;
      }
    },
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["coach", "dashboard", "activity"],
    queryFn: async () => {
      try {
        console.log("Calling getDashboardActivity...");
        const res = await coachApi.getDashboardActivity();
        console.log("getDashboardActivity result:", res);
        return res.data;
      } catch (err) {
        console.error("Error calling getDashboardActivity:", err);
        throw err;
      }
    },
  });

  return {
    stats: stats,
    activity: activity,
    isLoading: isLoadingStats || isLoadingActivity,
  };
}

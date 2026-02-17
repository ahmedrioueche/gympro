import { membersApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMySubscription } from "../../../../../../hooks/queries/useSubscription";
import { useUserStore } from "../../../../../../store/user";

export const useMemberHome = () => {
  const { user } = useUserStore();
  const { data: subscription } = useMySubscription();

  const { data: dashboardStats } = useQuery({
    queryKey: ["member", "dashboard", "stats", user?._id],
    queryFn: async () => {
      console.log("api call");
      const res = await membersApi.getDashboardStats();
      console.log({ res });
      return res.data;
    },
    enabled: !!user,
  });

  const nextClassLabel = dashboardStats?.nextClass
    ? format(new Date(dashboardStats.nextClass.startTime), "EEE, MMM d")
    : "No upcoming";

  return {
    user,
    subscription,
    stats: {
      activeSubscriptions: dashboardStats?.activeSubscriptions || 0,
      checkIns: dashboardStats?.checkIns || 0,
      nextClass: nextClassLabel,
      daysStreak: dashboardStats?.daysStreak || 0,
    },
  };
};

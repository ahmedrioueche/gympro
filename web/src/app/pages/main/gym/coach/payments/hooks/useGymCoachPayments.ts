import { gymCoachApi, gymCoachPaymentApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useGymStore } from "../../../../../../../store/gym";

export function useGymCoachPayments() {
  const { currentGym } = useGymStore();

  // Fetch affiliation to get actual commission rate
  const { data: affiliations, isLoading: isLoadingAffiliation } = useQuery({
    queryKey: ["coach-gyms"],
    queryFn: async () => {
      const response = await gymCoachApi.getCoachGyms();
      return response.data;
    },
  });

  const currentAffiliation = affiliations?.find(
    (a) => a.gymId === currentGym?._id,
  );

  // Fetch Payments History
  const { data: paymentsRes, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["coach-payments", currentGym?._id],
    queryFn: async () => {
      if (!currentGym?._id) return { data: [], total: 0 };
      const response = await gymCoachPaymentApi.getMyPayments(currentGym._id); // Page 1, limit 20 default
      if (response.success && response.data) {
        return response.data;
      }
      return { data: [], total: 0 };
    },
    enabled: !!currentGym?._id,
  });

  // Fetch Stats (Balance vs Total Earned)
  const { data: statsRes, isLoading: isLoadingStats } = useQuery({
    queryKey: ["coach-payment-stats", currentGym?._id],
    queryFn: async () => {
      if (!currentGym?._id) return { totalEarned: 0, pendingBalance: 0 };
      const response = await gymCoachPaymentApi.getMyStats(currentGym._id);
      if (response.success && response.data) {
        return response.data;
      }
      return { totalEarned: 0, pendingBalance: 0 };
    },
    enabled: !!currentGym?._id,
  });

  return {
    commissionRate: currentAffiliation?.commissionRate || 0,
    payments: paymentsRes?.data || [],
    totalEarnings: statsRes?.totalEarned || 0,
    pendingBalance: statsRes?.pendingBalance || 0,
    isLoading: isLoadingAffiliation || isLoadingPayments || isLoadingStats,
    currency: currentGym?.settings?.defaultCurrency || "USD",
  };
}

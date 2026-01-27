import {
  gymCoachPaymentApi,
  GymCoachPaymentStatus,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useCoachPayments = ({
  page = 1,
  limit = 20,
  status,
  gymId,
}: {
  page?: number;
  limit?: number;
  status?: GymCoachPaymentStatus;
  gymId?: string;
} = {}) => {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["coach", "payments", "stats", gymId],
    queryFn: async () => {
      const res = await gymCoachPaymentApi.getMyStats(gymId);
      return res.data;
    },
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["coach", "payments", "list", { page, limit, status, gymId }],
    queryFn: async () => {
      const res = await gymCoachPaymentApi.getMyPayments(
        gymId,
        page,
        limit,
        status,
      );
      return res.data;
    },
  });

  return {
    stats: stats,
    payments: payments?.data || [],
    totalPayments: payments?.total || 0,
    currentPage: payments?.page || 1,
    isLoading: isLoadingStats || isLoadingPayments,
  };
};

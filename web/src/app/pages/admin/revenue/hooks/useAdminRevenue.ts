import { adminApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useAdminRevenue = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: async () => {
      const res = await adminApi.getPayments();
      return res.data;
    },
  });

  const payments = data || [];

  const stats = useMemo(() => {
    const total = payments
      .filter((p) => p.status === "completed")
      .reduce((acc, p) => acc + p.amount, 0);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisMonth = payments
      .filter(
        (p) =>
          p.status === "completed" &&
          p.paidAt &&
          new Date(p.paidAt) >= thirtyDaysAgo,
      )
      .reduce((acc, p) => acc + p.amount, 0);

    const count = payments.filter((p) => p.status === "completed").length;

    return {
      total,
      thisMonth,
      count,
    };
  }, [payments]);

  return {
    payments,
    stats,
    isLoading,
    error,
    refetch,
  };
};

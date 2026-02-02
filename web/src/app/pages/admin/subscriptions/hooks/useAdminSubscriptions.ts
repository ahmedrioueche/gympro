import { adminApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useAdminSubscriptions = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["adminSubscriptions"],
    queryFn: async () => {
      const res = await adminApi.getSubscriptions();
      return res.data;
    },
  });

  const subscriptions = data || [];

  const stats = useMemo(() => {
    const active = subscriptions.filter((s) => s.status === "active").length;

    // Calculate Monthly Revenue (MRR)
    // For simplicity, we assume monthly price for monthly plans and yearly / 12 for yearly plans
    // But since we don't have the price in AdminSubscriptionView yet (just planName),
    // we would ideally need the amountPaid or plan pricing.
    // For now, let's just count them or use a placeholder if needed.
    // Actually, looking at the schema, we have billingCycle.

    const revenue = subscriptions.reduce((acc, s) => {
      if (s.status !== "active") return acc;
      // This is a placeholder calculation until we have real price data in the view
      return acc + 0;
    }, 0);

    const expiring = subscriptions.filter((s) => {
      if (s.status !== "active" || !s.currentPeriodEnd) return false;
      const end = new Date(s.currentPeriodEnd);
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      return days > 0 && days < 7;
    }).length;

    return {
      active,
      revenue,
      expiring,
    };
  }, [subscriptions]);

  return {
    subscriptions,
    stats,
    isLoading,
    error,
    refetch,
  };
};

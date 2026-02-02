import { adminApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const useAdminGyms = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["adminGyms"],
    queryFn: async () => {
      const res = await adminApi.getGyms();
      return res.data;
    },
  });

  const gyms = data || [];

  const filteredGyms = useMemo(() => {
    return gyms.filter((gym) => {
      const ownerName = gym.owner?.profile?.fullName || "";
      const ownerEmail = gym.owner?.profile?.email || "";

      const matchesSearch =
        gym.name?.toLowerCase().includes(search.toLowerCase()) ||
        gym.city?.toLowerCase().includes(search.toLowerCase()) ||
        ownerName.toLowerCase().includes(search.toLowerCase()) ||
        ownerEmail.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && gym.isActive) ||
        (statusFilter === "inactive" && !gym.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [gyms, search, statusFilter]);

  const stats = useMemo(() => {
    const total = gyms.length;
    const active = gyms.filter((g) => g.isActive).length;
    const inactive = total - active;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const newGyms = gyms.filter(
      (g) => g.createdAt && new Date(g.createdAt) >= thirtyDaysAgo,
    ).length;

    return {
      total,
      active,
      inactive,
      new: newGyms,
    };
  }, [gyms]);

  return {
    gyms: filteredGyms,
    totalGyms: gyms.length,
    stats,
    isLoading,
    error,
    refetch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  };
};

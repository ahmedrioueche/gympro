import { adminApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const useAdminUsers = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await adminApi.getUsers();
      return res.data;
    },
  });

  const users = data || [];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.profile?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.profile?.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.profile?.username?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = users.filter(
      (u) => u.createdAt && new Date(u.createdAt) >= thirtyDaysAgo,
    ).length;

    const coaches = users.filter((u) => u.role === "coach").length;
    const banned = users.filter((u) => u.profile?.isActive === false).length;

    return {
      total,
      new: newUsers,
      coaches,
      banned,
    };
  }, [users]);

  return {
    users: filteredUsers,
    totalUsers: users.length,
    stats,
    isLoading,
    error,
    refetch,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
  };
};

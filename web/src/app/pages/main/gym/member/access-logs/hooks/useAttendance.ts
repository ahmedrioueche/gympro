import { useMemo, useState } from "react";
import { useMyAttendanceInGym } from "../../../../../../../hooks/queries/useAttendance";

export const useAttendance = (gymId?: string) => {
  const { data: logsRes, isLoading } = useMyAttendanceInGym(gymId);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "granted" | "denied"
  >("all");

  const logs = logsRes?.data || [];

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "granted" && log.status === "checked_in") ||
        (statusFilter === "denied" && log.status === "denied");

      // For member view, search might be less relevant if it's only their logs,
      // but notes or gym name (if multiple) could be searched.
      const matchesSearch =
        !searchQuery ||
        log.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.gymId as any)?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [logs, statusFilter, searchQuery]);

  return {
    logs: filteredLogs,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  };
};

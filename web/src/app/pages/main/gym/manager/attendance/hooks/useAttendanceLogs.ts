import { type GymAttendanceRecord } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useAttendance } from "../../../../../../../hooks/queries/useAttendance";
import { useGymStore } from "../../../../../../../store/gym";

export type StatusFilter = "all" | "granted" | "denied";

export const useAttendanceLogs = () => {
  const { currentGym } = useGymStore();
  const { logs: logsRes, isLoadingLogs } = useAttendance(currentGym?._id);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const logs = (logsRes?.data || []) as unknown as GymAttendanceRecord[];

  const filteredLogs = logs.filter((log) => {
    const name = log.userId?.profile?.fullName?.toLowerCase() || "";
    const matchesSearch = name.includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "granted" && log.status === "checked_in") ||
      (statusFilter === "denied" && log.status === "denied");

    return matchesSearch && matchesStatus;
  });

  return {
    logs: filteredLogs,
    isLoading: isLoadingLogs,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
  };
};

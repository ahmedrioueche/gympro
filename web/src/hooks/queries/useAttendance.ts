import {
  type ApiResponse,
  attendanceApi,
  type AttendanceRecord,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useAttendance = (gymId?: string, skipLogs = false) => {
  const queryClient = useQueryClient();

  const checkInMutation = useMutation<
    ApiResponse<AttendanceRecord>,
    Error,
    { token: string; gymId: string }
  >({
    mutationFn: ({ token, gymId }: { token: string; gymId: string }) =>
      attendanceApi.checkIn(token, gymId),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["attendance-logs", gymId] });
      }
    },
  });

  const checkIn = useCallback(
    (data: { token: string; gymId: string }) =>
      checkInMutation.mutateAsync(data),
    [checkInMutation.mutateAsync]
  );

  const logsQuery = useQuery({
    queryKey: ["attendance-logs", gymId],
    queryFn: () => attendanceApi.getLogs(gymId!),
    enabled: !!gymId && !skipLogs,
  });

  return {
    checkIn,
    isCheckingIn: checkInMutation.isPending,
    logs: logsQuery.data,
    isLoadingLogs: logsQuery.isLoading,
  };
};

export const useAccessToken = (gymId?: string) => {
  return useQuery({
    queryKey: ["access-token", gymId],
    queryFn: () => attendanceApi.getAccessToken(gymId!),
    enabled: !!gymId,
    refetchInterval: 25000, // Refresh every 25 seconds (before 30s expiry)
    staleTime: 25000,
  });
};

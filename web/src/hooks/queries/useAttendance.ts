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

  const checkInByPinMutation = useMutation<
    ApiResponse<AttendanceRecord>,
    Error,
    { pin: string; gymId: string }
  >({
    mutationFn: ({ pin, gymId }: { pin: string; gymId: string }) =>
      attendanceApi.checkInByPin(gymId, pin),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["attendance-logs", gymId] });
      }
    },
  });

  const checkInByRfidMutation = useMutation<
    ApiResponse<AttendanceRecord>,
    Error,
    { rfidId: string; gymId: string }
  >({
    mutationFn: ({ rfidId, gymId }: { rfidId: string; gymId: string }) =>
      attendanceApi.checkInByRfid(gymId, rfidId),
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

  const checkInByPin = useCallback(
    (data: { pin: string; gymId: string }) =>
      checkInByPinMutation.mutateAsync(data),
    [checkInByPinMutation.mutateAsync]
  );

  const checkInByRfid = useCallback(
    (data: { rfidId: string; gymId: string }) =>
      checkInByRfidMutation.mutateAsync(data),
    [checkInByRfidMutation.mutateAsync]
  );

  const logsQuery = useQuery({
    queryKey: ["attendance-logs", gymId],
    queryFn: () => attendanceApi.getLogs(gymId!),
    enabled: !!gymId && !skipLogs,
  });

  return {
    checkIn,
    checkInByPin,
    checkInByRfid,
    isCheckingIn:
      checkInMutation.isPending ||
      checkInByPinMutation.isPending ||
      checkInByRfidMutation.isPending,
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

export const useMyAttendanceInGym = (gymId?: string) => {
  return useQuery({
    queryKey: ["my-attendance-logs", gymId],
    queryFn: () => attendanceApi.getMyAttendanceInGym(gymId!),
    enabled: !!gymId,
  });
};

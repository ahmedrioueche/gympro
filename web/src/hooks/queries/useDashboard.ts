import {
  dashboardApi,
  type RequestCoachAccessDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useToast } from "../useToast";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  available: () => [...dashboardKeys.all, "available"] as const,
};

/**
 * Get available dashboards for current user
 */
export const useAvailableDashboards = () => {
  return useQuery({
    queryKey: dashboardKeys.available(),
    queryFn: async () => {
      const response = await dashboardApi.getAvailableDashboards();
      return response.data;
    },
  });
};

/**
 * Request access to the coach dashboard
 */
export const useRequestCoachAccess = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (dto: RequestCoachAccessDto) => {
      const response = await dashboardApi.requestCoachAccess(dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.available() });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      success(
        t("dashboard.coachAccessGranted", "Coach dashboard access granted!")
      );
    },
    onError: (err: any) => {
      error(
        err?.message ||
          t("dashboard.coachAccessFailed", "Failed to request coach access")
      );
    },
  });
};

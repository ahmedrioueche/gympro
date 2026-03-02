import { adminApi, AlertStatus } from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../store/user";

export const useAlerts = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isLanding = window.location.pathname.startsWith("/landing");
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const alertsQuery = useQuery({
    queryKey: ["admin_alerts"],
    queryFn: () => adminApi.getAlerts(),
    enabled: !isLanding && isAuthenticated,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AlertStatus }) =>
      adminApi.updateAlertStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_alerts"] });
      toast.success(t("status.success.operation_completed"));
    },
    onError: () => {
      toast.error(t("status.error.unexpected"));
    },
  });

  return {
    alerts: alertsQuery.data?.data || [],
    isLoading: alertsQuery.isLoading,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
  };
};

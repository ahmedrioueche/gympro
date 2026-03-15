import { adminApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const useManageCoachRequest = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const approveMutation = useMutation({
    mutationFn: adminApi.approveCoachRequest,
    onSuccess: () => {
      toast.success(t("status.success.coach_request_approved"));
      queryClient.invalidateQueries({ queryKey: ["coachRequests"] });
    },
    onError: (error: any) => {
      toast.error(error.message || t("status.error.unexpected"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: adminApi.rejectCoachRequest,
    onSuccess: () => {
      toast.success(t("status.success.coach_request_rejected"));
      queryClient.invalidateQueries({ queryKey: ["coachRequests"] });
    },
    onError: (error: any) => {
      toast.error(error.message || t("status.error.unexpected"));
    },
  });

  return {
    approveRequest: approveMutation.mutate,
    isApproving: approveMutation.isPending,
    rejectRequest: rejectMutation.mutate,
    isRejecting: rejectMutation.isPending,
  };
};

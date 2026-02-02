import { adminApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const useUpdateGymStatus = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gymId: string) => adminApi.updateGymStatus(gymId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGyms"] });
      toast.success(t("common.update_success", "Status updated successfully"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("common.error_occurred"));
    },
  });
};

import { analyticsApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getMessage, showStatusToast } from "../../utils/statusMessage";

export function useGlobalAnalytics() {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ["analytics", "global"],
    queryFn: async () => {
      const res = await analyticsApi.getGlobalStats();

      if (!res.success) {
        const msg = getMessage(res, t);
        showStatusToast(msg, toast);
        throw new Error(msg.message);
      }
      return res.data;
    },
  });
}

export function useGymAnalytics(gymId: string) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ["analytics", "gym", gymId],
    queryFn: async () => {
      const res = await analyticsApi.getGymStats(gymId);

      if (!res.success) {
        const msg = getMessage(res, t);
        showStatusToast(msg, toast);
        throw new Error(msg.message);
      }
      return res.data;
    },
    enabled: !!gymId,
  });
}

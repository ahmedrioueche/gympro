import { notificationsApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  getMessage,
  showStatusToast,
} from "../../../../../../../utils/statusMessage";
export function useGymAnnouncements(gymId?: string) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ["gym-announcements", gymId],
    queryFn: async () => {
      if (!gymId) return [];

      const response = await notificationsApi.getMyNotifications(1, 10);

      if (!response.success || !response.data) {
        const msg = getMessage(response, t);
        showStatusToast(msg, toast);
        return [];
      }

      // Filter for announcements only - ideally would filter on backend
      const announcements = response.data.data.filter(
        (notification) => notification.type === "announcement"
      );

      return announcements;
    },
    enabled: !!gymId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

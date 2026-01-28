import {
  announcementApi,
  type CreateAnnouncementDto,
  type GymAnnouncement,
  type PaginatedResponse,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../../store/gym";
import { showStatusToast } from "../../../../../../../utils/statusMessage";

export const useAnnouncements = () => {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const currentGymId = currentGym?._id;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gym-announcements", currentGymId],
    queryFn: async () => {
      if (!currentGymId) throw new Error("No gym ID");
      const res = await announcementApi.getAll(currentGymId);
      return res as unknown as PaginatedResponse<GymAnnouncement>;
    },
    enabled: !!currentGymId,
  });

  const createMutation = useMutation({
    mutationFn: (newAnnouncement: CreateAnnouncementDto) =>
      announcementApi.create(newAnnouncement),
    onSuccess: () => {
      showStatusToast(t("announcements.createSuccess"), "success");
      queryClient.invalidateQueries({ queryKey: ["gym-announcements"] });
    },
    onError: (error: any) => {
      showStatusToast(error.message || t("common.error"), "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => announcementApi.delete(id),
    onSuccess: () => {
      showStatusToast(t("announcements.deleteSuccess"), "success");
      queryClient.invalidateQueries({ queryKey: ["gym-announcements"] });
    },
    onError: (error: any) => {
      showStatusToast(error.message || t("common.error"), "error");
    },
  });

  return {
    announcements: data?.data || [],
    isLoading,
    isError,
    createAnnouncement: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteAnnouncement: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

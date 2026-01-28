import {
  announcementApi,
  type GymAnnouncement,
  type PaginatedResponse,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { useGymStore } from "../../../../../../../store/gym";

export const useMemberAnnouncements = () => {
  const { currentGym } = useGymStore();
  const currentGymId = currentGym?._id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gym-announcements", currentGymId],
    queryFn: async () => {
      if (!currentGymId) throw new Error("No gym ID");
      const res = await announcementApi.getAll(currentGymId);
      return res as unknown as PaginatedResponse<GymAnnouncement>;
    },
    enabled: !!currentGymId,
  });

  return {
    announcements: data?.data || [],
    isLoading,
    isError,
  };
};

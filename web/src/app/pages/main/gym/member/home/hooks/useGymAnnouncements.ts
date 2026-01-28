import {
  announcementApi,
  type GymAnnouncement,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export function useGymAnnouncements(gymId?: string) {
  return useQuery<GymAnnouncement[]>({
    queryKey: ["gym-member-announcements", gymId],
    queryFn: async () => {
      if (!gymId) return [];

      const response = await announcementApi.getAll(gymId);

      // Response is PaginatedResponse<GymAnnouncement> with shape { data: [...], total, page, limit }
      // Extract the data array
      const announcements: GymAnnouncement[] = Array.isArray(response?.data)
        ? response.data
        : [];

      // Filter for active announcements only
      return announcements.filter((a) => a.isActive);
    },
    enabled: !!gymId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

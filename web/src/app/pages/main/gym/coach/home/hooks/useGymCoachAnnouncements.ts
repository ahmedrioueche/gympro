import {
  announcementApi,
  type GymAnnouncement,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export function useGymCoachAnnouncements(gymId?: string) {
  return useQuery<GymAnnouncement[]>({
    queryKey: ["gym-coach-announcements", gymId],
    queryFn: async () => {
      if (!gymId) return [];

      const response = await announcementApi.getAll(gymId);

      // Response is PaginatedResponse<GymAnnouncement>
      const announcements: GymAnnouncement[] = Array.isArray(response?.data)
        ? response.data
        : [];

      // Filter for active announcements
      return announcements.filter((a) => a.isActive);
    },
    enabled: !!gymId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

import { sessionApi, type Session } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, startOfDay } from "date-fns";

export function useGymCoachSessions() {
  return useQuery<Session[]>({
    queryKey: ["coach-today-sessions"],
    queryFn: async () => {
      const now = new Date();
      const start = startOfDay(now).toISOString();
      const end = endOfDay(now).toISOString();

      // Assuming getAll supports date filtering via query params
      // Adjust based on actual API capabilities if needed
      const response = await sessionApi.getAll({
        startDate: start,
        endDate: end,
      } as any);

      return Array.isArray(response.data) ? response.data : [];
    },
  });
}

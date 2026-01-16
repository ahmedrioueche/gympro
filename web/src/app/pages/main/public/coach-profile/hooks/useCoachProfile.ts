import { coachApi, type CoachProfile } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const coachProfileKeys = {
  all: ["coachProfile"] as const,
  detail: (coachId?: string) => [...coachProfileKeys.all, coachId] as const,
};

export const useCoachProfile = (coachId?: string) => {
  return useQuery<CoachProfile | null>({
    queryKey: coachProfileKeys.detail(coachId),
    queryFn: async () => {
      if (!coachId) return null;
      const response = await coachApi.getCoachProfile(coachId);
      return response.data ?? null;
    },
    enabled: !!coachId,
  });
};

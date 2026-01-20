import { usersApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const userProfileKeys = {
  all: ["userProfile"] as const,
  detail: (userId?: string) => [...userProfileKeys.all, userId] as const,
};

export const useUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: userProfileKeys.detail(userId),
    queryFn: async () => {
      if (!userId) return null;
      const response = await usersApi.getUser(userId);
      return response.data;
    },
    enabled: !!userId,
  });
};

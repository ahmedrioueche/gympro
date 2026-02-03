import { adminApi, type User } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useCoaches = (options?: { enabled?: boolean }) => {
  return useQuery<User[], Error>({
    queryKey: ["adminCoaches"],
    queryFn: async () => {
      const response = await adminApi.getCoaches();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch coaches");
      }
      return response.data;
    },
    ...options,
  });
};

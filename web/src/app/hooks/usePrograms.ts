import { trainingApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

interface UseProgramsOptions {
  source?: string;
  search?: string;
}

export const usePrograms = (options?: UseProgramsOptions) => {
  return useQuery({
    queryKey: ["programs", options?.source, options?.search],
    queryFn: async () => {
      const response = await trainingApi.getPrograms(
        options?.source,
        options?.search
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch programs");
      }

      return response.data;
    },
  });
};

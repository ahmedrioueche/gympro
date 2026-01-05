import { progressApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useProgressStats = () => {
  return useQuery({
    queryKey: ["progressStats"],
    queryFn: async () => {
      const { data } = await progressApi.getStats();
      return data;
    },
  });
};

export const useProgressHistory = () => {
  return useQuery({
    queryKey: ["progressHistory"],
    queryFn: async () => {
      const { data } = await progressApi.getHistory();
      return data;
    },
  });
};

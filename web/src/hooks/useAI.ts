import { aiApi } from "@ahmedrioueche/gympro-client";
import { useMutation } from "@tanstack/react-query";

export const useAI = () => {
  return useMutation({
    mutationFn: (prompt: string) => aiApi.getResponse(prompt),
  });
};

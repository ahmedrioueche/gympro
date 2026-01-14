import { coachApi, type RequestCoachDto } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getMessage, showStatusToast } from "../../utils/statusMessage";

export const useRequestCoach = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({
      coachId,
      data,
    }: {
      coachId: string;
      data: RequestCoachDto;
    }) => {
      const response = await coachApi.requestCoach(coachId, data);
      const msg = getMessage(response, t);
      showStatusToast(msg, toast);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches", "requests"] });
    },
  });
};

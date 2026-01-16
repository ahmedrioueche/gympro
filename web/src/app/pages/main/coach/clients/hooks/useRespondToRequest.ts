import {
  coachApi,
  type RespondToRequestDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../../../../hooks/useToast";

export const useRespondToRequest = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({
      requestId,
      data,
    }: {
      requestId: string;
      data: RespondToRequestDto;
    }) => {
      const response = await coachApi.respondToRequest(requestId, data);
      return { data: response.data, action: data.action };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["coach", "requests", "pending"],
      });
      queryClient.invalidateQueries({ queryKey: ["coach", "clients"] });

      success(
        result.action === "accept"
          ? t("coach.clients.modals.respond.acceptSuccess")
          : t("coach.clients.modals.respond.declineSuccess")
      );
    },
    onError: () => {
      error(t("coach.clients.modals.respond.error"));
    },
  });
};

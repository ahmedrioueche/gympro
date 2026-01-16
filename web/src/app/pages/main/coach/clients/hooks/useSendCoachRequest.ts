import {
  coachApi,
  type SendCoachRequestDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../../../../hooks/useToast";

export const useSendCoachRequest = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({
      memberId,
      data,
    }: {
      memberId: string;
      data: SendCoachRequestDto;
    }) => {
      const response = await coachApi.sendRequestToMember(memberId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["coach", "prospective-members"],
      });
      success(t("coach.clients.modals.sendRequest.success"));
    },
    onError: () => {
      error(t("coach.clients.modals.sendRequest.error"));
    },
  });
};

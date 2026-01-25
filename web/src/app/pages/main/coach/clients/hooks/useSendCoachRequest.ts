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
      memberName,
    }: {
      memberId: string;
      data: SendCoachRequestDto;
      memberName: string;
    }) => {
      const response = await coachApi.sendRequestToMember(memberId, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      success(
        t("coach.clients.modals.sendRequest.success", {
          memberName: variables.memberName,
          defaultValue: "Request sent successfully",
        }),
      );
      queryClient.invalidateQueries({
        queryKey: ["coach", "prospective-members"],
      });
      // Also invalidate gym-specific member lists
      queryClient.invalidateQueries({
        queryKey: ["gym-members-for-coach"],
      });
      // Invalidate sent requests list
      queryClient.invalidateQueries({
        queryKey: ["coach", "requests", "sent"],
      });
    },
    onError: () => {
      error(t("coach.clients.modals.sendRequest.error"));
    },
  });
};

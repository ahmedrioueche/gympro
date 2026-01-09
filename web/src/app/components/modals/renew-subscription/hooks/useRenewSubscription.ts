import { membershipApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../store/gym";
import { useModalStore } from "../../../../../store/modal";
import {
  getMessage,
  showStatusToast,
} from "../../../../../utils/statusMessage";
import { memberProfileKeys } from "../../../../pages/main/gym/manager/member-profile/hooks/useMemberProfile";

export interface RenewFormData {
  subscriptionTypeId: string;
  startDate: string;
  duration: string;
  paymentMethod: string;
}

export function useRenewSubscription() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { renewSubscriptionProps, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: RenewFormData) => {
      const gymId = currentGym?._id || "";
      const membershipId = renewSubscriptionProps?.membershipId || "";

      return membershipApi.reactivateSubscription(gymId, membershipId, {
        subscriptionTypeId: formData.subscriptionTypeId,
        startDate: formData.startDate,
        duration: formData.duration,
        paymentMethod: formData.paymentMethod,
      });
    },
    onSuccess: (res) => {
      const msg = getMessage(res, t);
      showStatusToast(msg, toast);

      if (res.success) {
        // Invalidate member profile query to refetch updated data
        queryClient.invalidateQueries({
          queryKey: memberProfileKeys.all,
        });
        closeModal();
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || error.message || t("common.error")
      );
    },
  });

  return {
    renewSubscription: mutation.mutate,
    isSubmitting: mutation.isPending,
  };
}

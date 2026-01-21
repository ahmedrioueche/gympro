import { gymCoachApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast"; // Fixed import
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import { useModalStore } from "../../../store/modal"; // Adjusted path

export default function GymInvitationModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, gymInvitationProps } = useModalStore();
  const queryClient = useQueryClient();

  const isOpen = currentModal === "gym_invitation";

  const { isPending, mutate } = useMutation({
    mutationFn: async (status: "active" | "rejected") => {
      if (!gymInvitationProps?.invitationId) return;
      return await gymCoachApi.respondToAffiliation(
        gymInvitationProps.invitationId,
        {
          accept: status === "active", // Fixed payload
        }
      );
    },
    onSuccess: (data, status) => {
      if (data?.success) {
        toast.success(
          status === "active"
            ? t("notifications.invitationAccepted")
            : t("notifications.invitationDeclined")
        );
        // Invalidate all relevant queries
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["affiliations"] });
        queryClient.invalidateQueries({ queryKey: ["gyms", "all-my-gyms"] });
        queryClient.invalidateQueries({ queryKey: ["gyms"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        closeModal();
      } else {
        toast.error(data?.message || t("common.error"));
      }
    },
    onError: () => {
      toast.error(t("common.error"));
    },
  });

  if (!isOpen || !gymInvitationProps) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("notifications.invitationTitle")}
      primaryButton={{
        label: t("common.accept"),
        onClick: () => mutate("active"),
        loading: isPending,
        icon: Check,
      }}
      secondaryButton={{
        label: t("common.decline"),
        onClick: () => mutate("rejected"),
        disabled: isPending,
        icon: X,
      }}
    >
      <div className="space-y-4">
        <p className="text-text-secondary">
          {t("notifications.invitationMessage", {
            gymName: gymInvitationProps.gymName,
          })}
        </p>
      </div>
    </BaseModal>
  );
}

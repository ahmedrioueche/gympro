import { gymCoachApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, MessageSquare, X } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import { useGym } from "../../../hooks/queries/useGyms";
import { useModalStore } from "../../../store/modal";
import GymCard from "../gym/gym-card/GymCard";

export default function GymInvitationModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, gymInvitationProps } = useModalStore();
  const queryClient = useQueryClient();

  const isOpen = currentModal === "gym_invitation";

  // Fetch gym details if gymId is available
  const { data: gym, isLoading: isLoadingGym } = useGym(
    gymInvitationProps?.gymId || "",
    isOpen && !!gymInvitationProps?.gymId,
  );

  const { isPending, mutate } = useMutation({
    mutationFn: async (status: "active" | "rejected") => {
      if (!gymInvitationProps?.invitationId) return;
      return await gymCoachApi.respondToAffiliation(
        gymInvitationProps.invitationId,
        {
          accept: status === "active",
        },
      );
    },
    onSuccess: (data, status) => {
      if (data?.success) {
        toast.success(
          status === "active"
            ? t("notifications.invitationAccepted")
            : t("notifications.invitationDeclined"),
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
      icon={MessageSquare}
      maxWidth="max-w-3xl"
      primaryButton={{
        label: t("common.accept"),
        onClick: () => mutate("active"),
        loading: isPending,
        disabled: isLoadingGym,
        icon: Check,
      }}
      secondaryButton={{
        label: t("common.decline"),
        onClick: () => mutate("rejected"),
        disabled: isPending || isLoadingGym,
        icon: X,
      }}
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-text-primary font-medium">
            {t("notifications.invitationMessage", {
              gymName: gymInvitationProps.gymName,
            })}
          </p>
        </div>

        {isLoadingGym ? (
          <div className="flex flex-col items-center justify-center p-12 bg-background/50 rounded-2xl border border-dashed border-border gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-text-secondary">
              {t("common.loadingGymDetails", "Loading gym details...")}
            </p>
          </div>
        ) : gym ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GymCard gym={gym} onSelect={() => {}} hideActions={true} />
          </div>
        ) : null}
      </div>
    </BaseModal>
  );
}

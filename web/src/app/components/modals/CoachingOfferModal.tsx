import { coachApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, MessageSquare, User, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import { useModalStore } from "../../../store/modal";

export default function CoachingOfferModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, coachingOfferProps } = useModalStore();
  const queryClient = useQueryClient();
  const [response, setResponse] = useState("");

  const isOpen = currentModal === "coaching_offer";

  const { isPending, mutate } = useMutation({
    mutationFn: async (action: "accept" | "decline") => {
      if (!coachingOfferProps?.requestId) return;
      return await coachApi.respondToRequest(coachingOfferProps.requestId, {
        action,
        response: response.trim() || undefined,
      });
    },
    onSuccess: (data, action) => {
      if (data?.success) {
        toast.success(
          action === "accept"
            ? t("coaching.offer.accepted")
            : t("coaching.offer.declined"),
        );
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["coach-requests"] });
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

  if (!isOpen || !coachingOfferProps) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("coaching.offer.title")}
      icon={User}
      primaryButton={{
        label: t("common.accept"),
        onClick: () => mutate("accept"),
        loading: isPending,
        icon: Check,
        variant: "primary",
      }}
      secondaryButton={{
        label: t("common.decline"),
        onClick: () => mutate("decline"),
        disabled: isPending,
        icon: X,
      }}
    >
      <div className="space-y-6">
        <div className="p-4 bg-background/50 rounded-2xl border border-border flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center flex-shrink-0">
            {coachingOfferProps.coachImageUrl ? (
              <img
                src={coachingOfferProps.coachImageUrl}
                alt={coachingOfferProps.coachName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-7 h-7 text-primary" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-text-primary text-lg capitalize">
              {coachingOfferProps.coachName}
            </h4>
            <p className="text-sm text-text-secondary">
              {t("coaching.offer.details")}
            </p>
          </div>
        </div>

        {coachingOfferProps.message && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest not-italic">
              <MessageSquare className="w-3 h-3 text-primary" />
              {t("coaching.offer.coachMessage")}
            </div>
            <div className="p-4 bg-surface rounded-2xl border border-border italic text-text-secondary relative">
              "{coachingOfferProps.message}"
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-secondary">
            {t("coaching.offer.yourResponse")}
          </label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={t("coaching.offer.responsePlaceholder")}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors min-h-[100px] resize-none"
          />
        </div>
      </div>
    </BaseModal>
  );
}

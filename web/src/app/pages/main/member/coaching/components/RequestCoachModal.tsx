import { type CoachProfile } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../components/ui/BaseModal";
import TextArea from "../../../../../../components/ui/TextArea";
import { useRequestCoach } from "../../../../../../hooks/mutations/useRequestCoach";

interface RequestCoachModalProps {
  coach: CoachProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestCoachModal({
  coach,
  isOpen,
  onClose,
}: RequestCoachModalProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const requestCoachMutation = useRequestCoach();

  const handleSubmit = async () => {
    if (!coach) return;

    await requestCoachMutation.mutateAsync({
      coachId: coach.userId,
      data: { message: message.trim() || undefined },
    });

    setMessage("");
    onClose();
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  if (!coach) return null;

  const displayName = coach.fullName || coach.username;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("coaches.requestModal.title", { coachName: displayName })}
      subtitle={t("coaches.requestModal.send")}
      primaryButton={{
        label: t("coaches.requestModal.send"),
        type: "submit",
        loading: requestCoachMutation.isPending,
      }}
    >
      <div className="space-y-4">
        {/* Coach Info */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-hover border border-border">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-text-primary">{displayName}</p>
            {coach.location && (
              <p className="text-sm text-text-secondary">
                {[coach.location.city, coach.location.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("coaches.requestModal.message")}
          </label>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("coaches.requestModal.messagePlaceholder")}
            rows={4}
          />
          <p className="text-xs text-text-secondary mt-2">
            {t("coaches.requestModal.messageHint")}
          </p>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {t("coaches.requestModal.info")}
          </p>
        </div>
      </div>
    </BaseModal>
  );
}

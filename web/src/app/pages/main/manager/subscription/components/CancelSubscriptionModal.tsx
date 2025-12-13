import {
  appSubscriptionsApi,
  type ApiResponse,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../components/ui/BaseModal";
import TextArea from "../../../../../../components/ui/TextArea";
import { planKeys } from "../../../../../../hooks/queries/usePlans";
import { useToast } from "../../../../../../hooks/useToast";
import {
  getMessage,
  showStatusToast,
} from "../../../../../../utils/statusMessage";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionEndDate?: string | Date;
}

type CancelStep = "contact" | "reason";

function CancelSubscriptionModal({
  isOpen,
  onClose,
  subscriptionEndDate,
}: CancelSubscriptionModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<CancelStep>("contact");
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const handleClose = () => {
    setStep("contact");
    setReason("");
    onClose();
  };

  const cancelMutation = useMutation({
    mutationFn: async (reason: string) => {
      return await appSubscriptionsApi.cancelSubscription(reason);
    },
    onSuccess: (response: ApiResponse) => {
      queryClient.invalidateQueries({ queryKey: planKeys.mySubscription() });
      const msg = getMessage(response, t);
      console.log(msg);
      showStatusToast(msg, { success, error });
      handleClose();
    },
    onError: (err: ApiResponse) => {
      const msg = getMessage(err, t);
      console.log(msg);
      showStatusToast(msg, { success, error });
      queryClient.invalidateQueries({ queryKey: planKeys.mySubscription() });
      handleClose();
    },
  });

  const handleContactSupport = () => {
    const email = "support@gympro.com";
    const subject = encodeURIComponent(
      t("subscription.cancel_support_subject")
    );
    const body = encodeURIComponent(t("subscription.cancel_support_body"));
    window.open(
      `https://mail.google.com/mail/?view=cm&to=${email}&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  const handleContinueToCancellation = () => {
    setStep("reason");
  };

  const handleBackToContact = () => {
    setStep("contact");
  };

  const handleCancel = () => {
    if (isReasonValid) {
      cancelMutation.mutate(reason);
    }
  };

  // Validation: must be at least 10 characters and not just whitespace
  const isReasonValid = reason.trim().length >= 10;

  const endDateFormatted = subscriptionEndDate
    ? new Date(subscriptionEndDate).toLocaleDateString()
    : "";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        step === "contact"
          ? t("subscription.cancel_modal_title")
          : t("subscription.cancel_reason_title")
      }
      icon={AlertTriangle}
      width="700px"
    >
      {step === "contact" ? (
        // Step 1: Contact Support
        <div className="space-y-6">
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
            <p className="text-text-primary mb-4">
              {t("subscription.cancel_contact_message")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
              <li>{t("subscription.cancel_reason_billing")}</li>
              <li>{t("subscription.cancel_reason_features")}</li>
              <li>{t("subscription.cancel_reason_support")}</li>
              <li>{t("subscription.cancel_reason_other")}</li>
            </ul>
          </div>

          <p className="text-text-secondary text-sm">
            {t("subscription.cancel_contact_encourage")}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleContactSupport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium"
            >
              <Mail className="w-4 h-4" />
              {t("subscription.contact_support")}
            </button>
            <button
              onClick={handleContinueToCancellation}
              className="flex-1 px-4 py-3 bg-surface hover:bg-surface-hover text-text-primary border border-border rounded-xl transition-all font-medium"
            >
              {t("subscription.continue_cancellation")}
            </button>
          </div>
        </div>
      ) : (
        // Step 2: Cancellation Reason
        <div className="space-y-6">
          <div className="bg-danger/10 border border-danger/30 rounded-xl p-4">
            <p className="text-text-primary font-medium mb-2">
              {t("subscription.cancel_warning_title")}
            </p>
            <p className="text-text-secondary text-sm">
              {t("subscription.cancel_warning_message", {
                date: endDateFormatted,
              })}
            </p>
          </div>

          <TextArea
            label={t("subscription.cancel_reason_label")}
            placeholder={t("subscription.cancel_reason_placeholder")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="resize-none"
          />

          {reason.trim().length > 0 && !isReasonValid && (
            <p className="text-warning text-sm">
              {t("subscription.cancel_reason_too_short")}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBackToContact}
              className="flex-1 px-4 py-3 bg-surface hover:bg-surface-hover text-text-primary border border-border rounded-xl transition-all font-medium"
            >
              {t("common.back")}
            </button>
            <button
              onClick={handleCancel}
              disabled={!isReasonValid || cancelMutation.isPending}
              className="flex-1 px-4 py-3 bg-danger text-white rounded-xl hover:bg-danger/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelMutation.isPending
                ? t("common.processing")
                : t("subscription.cancel_subscription")}
            </button>
          </div>

          {cancelMutation.isError && (
            <p className="text-danger text-sm text-center">
              {t("subscription.cancel_error")}
            </p>
          )}
        </div>
      )}
    </BaseModal>
  );
}

export default CancelSubscriptionModal;

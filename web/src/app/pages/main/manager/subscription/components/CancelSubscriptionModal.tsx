import {
  appSubscriptionsApi,
  type ApiResponse,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Mail, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../components/ui/BaseModal";
import TextArea from "../../../../../../components/ui/TextArea";
import { planKeys } from "../../../../../../hooks/queries/useSubscription";
import { useDebounce } from "../../../../../../hooks/useDebounce";
import { useToast } from "../../../../../../hooks/useToast";
import { handleContactSupport } from "../../../../../../utils/contact";
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
type ValidationState = "idle" | "validating" | "valid" | "invalid";

function CancelSubscriptionModal({
  isOpen,
  onClose,
  subscriptionEndDate,
}: CancelSubscriptionModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<CancelStep>("contact");
  const [reason, setReason] = useState("");
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // Debounce the reason input (wait 800ms after user stops typing)
  const debouncedReason = useDebounce(reason, 800);

  const handleClose = () => {
    setStep("contact");
    setReason("");
    setValidationState("idle");
    onClose();
  };

  // Validation mutation
  const validateMutation = useMutation({
    mutationFn: async (reason: string) => {
      const response = await appSubscriptionsApi.validateCancellationReason(
        reason
      );
      return response;
    },
    onSuccess: (response: ApiResponse<"true" | "false">) => {
      if (response.data === "true") {
        setValidationState("valid");
      } else {
        setValidationState("invalid");
      }
    },
    onError: () => {
      setValidationState("invalid");
    },
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: async (reason: string) => {
      return await appSubscriptionsApi.cancelSubscription(reason);
    },
    onSuccess: (response: ApiResponse) => {
      queryClient.invalidateQueries({ queryKey: planKeys.mySubscription() });
      const msg = getMessage(response, t);
      showStatusToast(msg, { success, error });
      handleClose();
    },
    onError: (err: ApiResponse) => {
      const msg = getMessage(err, t);
      showStatusToast(msg, { success, error });
      queryClient.invalidateQueries({ queryKey: planKeys.mySubscription() });
      handleClose();
    },
  });

  // Validate reason when debounced value changes
  useEffect(() => {
    if (step === "reason" && debouncedReason.trim().length >= 10) {
      setValidationState("validating");
      validateMutation.mutate(debouncedReason);
    } else if (
      debouncedReason.trim().length > 0 &&
      debouncedReason.trim().length < 10
    ) {
      setValidationState("invalid");
    } else {
      setValidationState("idle");
    }
  }, [debouncedReason, step]);

  const handleContinueToCancellation = () => {
    setStep("reason");
  };

  const handleBackToContact = () => {
    setStep("contact");
    setReason("");
    setValidationState("idle");
  };

  const handleCancel = () => {
    if (validationState === "valid") {
      cancelMutation.mutate(reason);
    }
  };

  const endDateFormatted = subscriptionEndDate
    ? new Date(subscriptionEndDate).toLocaleDateString()
    : "";

  // Determine if cancel button should be enabled
  const canSubmit = validationState === "valid" && !cancelMutation.isPending;

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
              onClick={() =>
                handleContactSupport(
                  t,
                  t("subscription.cancel_support_subject"),
                  t("subscription.cancel_support_body")
                )
              }
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

          <div className="space-y-2">
            <TextArea
              label={t("subscription.cancel_reason_label")}
              placeholder={t("subscription.cancel_reason_placeholder")}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />

            {/* Validation Feedback */}
            {validationState === "validating" && reason.trim().length >= 10 && (
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <div className="w-4 h-4 border-2 border-text-secondary/30 border-t-text-secondary rounded-full animate-spin" />
                <span>{t("subscription.validating_reason")}</span>
              </div>
            )}

            {validationState === "valid" && (
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>{t("subscription.thanks_for_feedback")}</span>
              </div>
            )}

            {validationState === "invalid" && reason.trim().length >= 10 && (
              <div className="flex items-center gap-2 text-danger text-sm">
                <XCircle className="w-4 h-4" />
                <span>{t("subscription.reason_invalid")}</span>
              </div>
            )}

            {reason.trim().length > 0 && reason.trim().length < 10 && (
              <p className="text-warning text-sm">
                {t("subscription.cancel_reason_too_short")}
              </p>
            )}
          </div>

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
              disabled={!canSubmit}
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

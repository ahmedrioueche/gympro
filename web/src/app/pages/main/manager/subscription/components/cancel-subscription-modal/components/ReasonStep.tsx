import { CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import TextArea from "../../../../../../../../components/ui/TextArea";

interface ReasonStepProps {
  reason: string;
  onReasonChange: (reason: string) => void;
  validationState: "idle" | "validating" | "valid" | "invalid";
  subscriptionEndDate?: string | Date;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  isError: boolean;
}

export function ReasonStep({
  reason,
  onReasonChange,
  validationState,
  subscriptionEndDate,
  onBack,
  onSubmit,
  isSubmitting,
  canSubmit,
  isError,
}: ReasonStepProps) {
  const { t } = useTranslation();

  const endDateFormatted = subscriptionEndDate
    ? new Date(subscriptionEndDate).toLocaleDateString()
    : "";

  return (
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
          onChange={(e) => onReasonChange(e.target.value)}
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
          onClick={onBack}
          className="flex-1 px-4 py-3 bg-surface hover:bg-surface-hover text-text-primary border border-border rounded-xl transition-all font-medium"
        >
          {t("common.back")}
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 px-4 py-3 bg-danger text-white rounded-xl hover:bg-danger/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? t("common.processing")
            : t("subscription.cancel_subscription")}
        </button>
      </div>

      {isError && (
        <p className="text-danger text-sm text-center">
          {t("subscription.cancel_error")}
        </p>
      )}
    </div>
  );
}

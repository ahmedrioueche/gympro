import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ModalFooterProps {
  isSubmitting: boolean;
  isExtending: boolean;
  onCancel: () => void;
}

export function ModalFooter({
  isSubmitting,
  isExtending,
  onCancel,
}: ModalFooterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 pt-4 border-t border-border">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-4 py-3 bg-surface border border-border text-text-primary font-semibold rounded-xl hover:bg-surface-hover transition-colors"
      >
        {t("common.cancel")}
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            {t("common.saving")}
          </>
        ) : isExtending ? (
          t("renewSubscription.extendSubmit", "Extend Subscription")
        ) : (
          t("renewSubscription.submit")
        )}
      </button>
    </div>
  );
}

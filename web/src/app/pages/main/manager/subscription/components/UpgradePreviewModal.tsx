import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../../store/modal";

export default function UpgradePreviewModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, upgradePreviewProps } = useModalStore();

  const immediateTotal =
    upgradePreviewProps?.previewData?.immediate_transaction?.details?.totals
      ?.total || "0";
  const credit = upgradePreviewProps?.previewData?.credit || "0";
  const chargeTotal =
    upgradePreviewProps?.previewData?.update_summary?.charge?.total ||
    immediateTotal;

  // Format currency
  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return `$${(num / 100).toFixed(2)}`;
  };

  if (currentModal !== "upgrade_preview") return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-lg w-full border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {t("upgrade.confirm_title", "Confirm Upgrade")}
              </h3>
              <p className="text-white/80 text-sm">
                {t("upgrade.review_changes", "Please review the changes below")}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-white/80 hover:text-white transition-colors"
              disabled={upgradePreviewProps.isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Plan Comparison */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-xl">
              <div>
                <p className="text-xs text-text-secondary mb-1">
                  {t("upgrade.current_plan", "Current Plan")}
                </p>
                <p className="font-semibold text-text-primary">
                  {upgradePreviewProps.currentPlan.name}
                </p>
              </div>
            </div>

            <div className="flex justify-center -my-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shadow-sm">
                <svg
                  className="w-4 h-4 text-text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
              <div>
                <p className="text-xs text-text-secondary mb-1">
                  {t("upgrade.new_plan", "New Plan")}
                </p>
                <p className="font-semibold text-text-primary">
                  {upgradePreviewProps.targetPlan.name}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-surface-secondary rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">
                {t("upgrade.prorated_charge", "Prorated Charge")}
              </span>
              <span className="font-medium text-text-primary">
                {formatAmount(immediateTotal)}
              </span>
            </div>

            {credit !== "0" && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-600">
                  {t("upgrade.credit_applied", "Credit Applied")}
                </span>
                <span className="font-medium text-emerald-600">
                  -{formatAmount(credit)}
                </span>
              </div>
            )}

            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-primary">
                  {t("upgrade.total_due_now", "Total Due Now")}
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatAmount(chargeTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Info Notice */}
          <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                {t("upgrade.proration_notice_title", "Automatic Payment")}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                {t(
                  "upgrade.proration_notice_text",
                  "If you confirm, we will attempt to charge your card on file immediately. If payment fails, you will be redirected to complete the payment."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-secondary border-t border-border flex gap-3">
          <button
            onClick={closeModal}
            disabled={upgradePreviewProps.isLoading}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border border-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            onClick={upgradePreviewProps.onConfirm}
            disabled={upgradePreviewProps.isLoading}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {upgradePreviewProps.isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {t("upgrade.confirm_upgrade", "Confirm Upgrade")}
          </button>
        </div>
      </div>
    </div>
  );
}

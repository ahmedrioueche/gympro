import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CancelSubscriptionButtonProps {
  subscription: any;
  onCancel: () => void;
  isProcessing: boolean;
}

function CancelSubscriptionButton({
  subscription,
  onCancel,
  isProcessing,
}: CancelSubscriptionButtonProps) {
  const { t } = useTranslation();

  if (
    subscription.status !== "active" ||
    subscription.cancelAtPeriodEnd ||
    subscription.plan?.level === "free"
  ) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex justify-end mt-4 px-2">
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-danger hover:underline transition-colors px-4 py-2 rounded-lg hover:bg-danger/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
          {t("subscription.cancel_subscription")}
        </button>
      </div>
    </div>
  );
}

export default CancelSubscriptionButton;

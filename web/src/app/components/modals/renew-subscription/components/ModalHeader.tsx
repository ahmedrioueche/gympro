import { RefreshCw, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ModalHeaderProps {
  memberName: string;
  isExtending: boolean;
  onClose: () => void;
}

export function ModalHeader({
  memberName,
  isExtending,
  onClose,
}: ModalHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">
            {isExtending
              ? t("renewSubscription.extendTitle", "Extend Subscription")
              : t("renewSubscription.title")}
          </h2>
          <p className="text-sm text-text-secondary">{memberName}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-surface-hover rounded-xl transition-colors"
      >
        <X className="w-5 h-5 text-text-secondary" />
      </button>
    </div>
  );
}

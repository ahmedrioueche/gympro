import { UserCog } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MemberProfileActionsProps {
  onClose: () => void;
  onEdit: () => void;
}

export function MemberProfileActions({
  onClose,
  onEdit,
}: MemberProfileActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end gap-3 w-full">
      <button
        className="px-4 py-2 rounded-xl border border-border bg-surface hover:bg-surface-hover text-text-secondary font-medium transition-colors flex items-center gap-2"
        onClick={onClose}
      >
        {t("common.close")}
      </button>
      <button
        className="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        onClick={onEdit}
      >
        <UserCog className="w-4 h-4" />
        {t("actions.edit")}
      </button>
    </div>
  );
}

import { UserCog } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ClientProfileActionsProps {
  onClose: () => void;
  onAssignProgram: () => void;
}

export function ClientProfileActions({
  onClose,
  onAssignProgram,
}: ClientProfileActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end gap-3 w-full">
      <button
        className="px-4 py-2 rounded-xl border border-border bg-surface hover:bg-surface-hover text-text-secondary font-medium transition-colors"
        onClick={onClose}
      >
        {t("common.close")}
      </button>
      <button
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        onClick={onAssignProgram}
      >
        <UserCog className="w-4 h-4" />
        {t("coach.clients.activeClients.assignProgram")}
      </button>
    </div>
  );
}

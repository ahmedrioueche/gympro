import { AlertTriangle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  memberName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  memberName,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-text-primary text-center mb-2">
          {t("members.delete.title")}
        </h2>

        {/* Message */}
        <p className="text-text-secondary text-center mb-6">
          {t("members.delete.message", { name: memberName })}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-background border border-border text-text-primary font-medium rounded-xl hover:bg-surface-hover transition-colors disabled:opacity-50"
          >
            {t("actions.cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-danger text-white font-medium rounded-xl hover:bg-danger/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("actions.deleting")}
              </>
            ) : (
              t("actions.delete")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

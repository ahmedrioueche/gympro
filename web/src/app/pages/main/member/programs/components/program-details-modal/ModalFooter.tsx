import { Dumbbell, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ModalFooterProps {
  isEditMode: boolean;
  isSaving: boolean;
  isActive: boolean;
  programId: string;
  onSave: () => void;
  onCancel: () => void;
  onClose: () => void;
  onUse: (programId: string) => void;
}

export const ModalFooter = ({
  isEditMode,
  isSaving,
  isActive,
  programId,
  onSave,
  onCancel,
  onClose,
  onUse,
}: ModalFooterProps) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 bg-surface-secondary border-t-2 border-border flex-shrink-0">
      <div className="flex gap-3">
        {isEditMode ? (
          <>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all disabled:opacity-50"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("common.saving")}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {t("common.save")}
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all"
            >
              {t("common.close")}
            </button>
            <button
              type="button"
              onClick={() => {
                onUse(programId);
                onClose();
              }}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Dumbbell className="w-5 h-5" />
              {isActive
                ? t("training.programs.details.continue")
                : t("training.programs.details.start")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

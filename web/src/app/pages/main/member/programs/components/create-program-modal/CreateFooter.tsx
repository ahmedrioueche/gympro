import { Plus, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CreateFooterProps {
  step: number;
  isSaving: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const CreateFooter = ({
  step,
  isSaving,
  onBack,
  onNext,
}: CreateFooterProps) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 bg-surface-secondary border-t-2 border-border flex-shrink-0">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 1 ? t("common.cancel", "Cancel") : t("common.back", "Back")}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isSaving}
          className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("common.creating", "Creating...")}
            </>
          ) : step === 1 ? (
            <>
              {t("common.next", "Next")}
              <Plus className="w-5 h-5" />
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {t("training.programs.create.createButton")}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

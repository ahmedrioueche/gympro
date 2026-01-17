import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ExerciseModalFooterProps {
  onClose: () => void;
  onSubmit: () => void;
  isPending: boolean;
  isValid: boolean;
}

export function ExerciseModalFooter({
  onClose,
  onSubmit,
  isPending,
  isValid,
}: ExerciseModalFooterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all"
      >
        {t("common.cancel")}
      </button>
      <button
        onClick={onSubmit}
        disabled={isPending || !isValid}
        className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        {t("common.save")}
      </button>
    </div>
  );
}

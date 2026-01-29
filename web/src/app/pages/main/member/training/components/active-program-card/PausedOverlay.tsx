import { Pause } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PausedOverlayProps {
  onResume: () => void;
}

export const PausedOverlay = ({ onResume }: PausedOverlayProps) => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
      <div className="bg-surface border border-border rounded-xl p-4 shadow-xl text-center max-w-xs mx-4">
        <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-3">
          <Pause size={24} />
        </div>
        <h3 className="font-bold text-text-primary mb-1">
          {t("training.programs.card.paused")}
        </h3>
        <p className="text-xs text-text-secondary mb-4">
          {t("training.programs.card.pausedDesc")}
        </p>
        <button
          onClick={onResume}
          className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {t("training.programs.card.resume")}
        </button>
      </div>
    </div>
  );
};

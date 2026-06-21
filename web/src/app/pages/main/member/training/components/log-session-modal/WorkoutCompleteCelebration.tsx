import { CheckCircle, Sparkles, Trophy } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import Confetti from "../../../../../../../components/ui/Confetti";

interface WorkoutCompleteCelebrationProps {
  dayName: string;
  completedSets: number;
  totalSets: number;
  onClose: () => void;
}

export const WorkoutCompleteCelebration = ({
  dayName,
  completedSets,
  totalSets,
  onClose,
}: WorkoutCompleteCelebrationProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="workout-complete-title"
    >
      <Confetti />

      <div
        className="relative w-full max-w-sm bg-surface border-2 border-success/30 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-success/20 via-primary/10 to-secondary/20 px-6 pt-8 pb-6 text-center">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Sparkles
              className="absolute top-4 left-6 w-5 h-5 text-yellow-400 animate-sparkle"
              style={{ animationDelay: "0s" }}
            />
            <Sparkles
              className="absolute top-6 right-8 w-4 h-4 text-emerald-400 animate-sparkle"
              style={{ animationDelay: "0.6s" }}
            />
            <Sparkles
              className="absolute bottom-8 left-10 w-4 h-4 text-primary animate-sparkle"
              style={{ animationDelay: "1.2s" }}
            />
          </div>

          <div className="relative mx-auto mb-5 w-20 h-20 rounded-full bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center shadow-lg animate-success-pulse">
            <Trophy className="w-10 h-10 text-white animate-success-bounce" />
          </div>

          <h2
            id="workout-complete-title"
            className="text-2xl font-bold text-text-primary mb-2"
          >
            {t("training.logSession.completeTitle")}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t("training.logSession.completeMessage", { dayName })}
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-success/10 border border-success/20 px-4 py-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-sm font-semibold text-text-primary">
              {t("training.logSession.completeStats", {
                completed: completedSets,
                total: totalSets,
              })}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-success to-emerald-600 hover:from-success/90 hover:to-emerald-600/90 transition-all shadow-md"
          >
            {t("training.logSession.continue")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

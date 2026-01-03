import { Dumbbell, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CreateHeaderProps {
  step: number;
  onClose: () => void;
}

export const CreateHeader = ({ step, onClose }: CreateHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-primary to-secondary p-6 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {step === 1
                ? t("training.programs.create.title")
                : t("training.programs.create.schedule")}
            </h2>
            <p className="text-white/90 text-sm">
              {step === 1
                ? t("training.programs.create.subtitle")
                : t("training.programs.create.scheduleSubtitle")}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

import { type TrainingProgram } from "@ahmedrioueche/gympro-client";
import { Dumbbell, Edit3, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ModalHeaderProps {
  program: TrainingProgram;
  isEditMode: boolean;
  editName?: string;
  onEditNameChange: (name: string) => void;
  onEditClick: () => void;
  onClose: () => void;
}

export const ModalHeader = ({
  program,
  isEditMode,
  editName,
  onEditNameChange,
  onEditClick,
  onClose,
}: ModalHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-primary to-secondary p-6 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <div>
            {isEditMode ? (
              <input
                type="text"
                value={editName || ""}
                onChange={(e) => onEditNameChange(e.target.value)}
                className="text-2xl font-bold text-white bg-white/20 rounded-lg px-3 py-1 border border-white/30 outline-none focus:border-white/50 mb-1"
              />
            ) : (
              <h2 className="text-2xl font-bold text-white mb-1">
                {program.name}
              </h2>
            )}
            <p className="text-white/90 text-sm capitalize">
              {program.experience} •{" "}
              {t("training.programs.card.daysPerWeek", {
                count: program.daysPerWeek,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditMode && program.creationType === "member" && (
            <button
              onClick={onEditClick}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              title={t("common.edit")}
            >
              <Edit3 className="w-5 h-5 text-white" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

import {
  type ProgramDayProgress,
  type ProgramHistory,
} from "@ahmedrioueche/gympro-client";
import { Calendar, Dumbbell, Save, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import { useLogSession } from "../../../../../../../hooks/queries/useTraining";
import { ExerciseDetailModal } from "../../../../../../components/gym/ExerciseDetailModal";
import { SessionExerciseCard } from "./SessionExerciseCard";
import { useSessionForm } from "./useSessionForm";

interface LogSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeHistory: ProgramHistory;
  initialSession?: ProgramDayProgress;
}

export const LogSessionModal = ({
  isOpen,
  onClose,
  activeHistory,
  initialSession,
}: LogSessionModalProps) => {
  const { program } = activeHistory;
  const { t } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const logSession = useLogSession();
  const form = useSessionForm({ isOpen, activeHistory, initialSession });

  const handleSave = () => {
    logSession.mutate(
      {
        programId: program._id!,
        dayName: form.selectedDayName,
        date: form.sessionDate,
        exercises: form.exercises,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const currentDay = program.days.find((d) => d.name === form.selectedDayName);

  if (!isOpen) return null;

  const dayOptions = program.days.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl max-w-3xl max-h-[99vh] w-full border-2 border-primary/30 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {t("training.logSession.title")}
                </h2>
                <p className="text-white/90 text-sm">{program.name}</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="p-6 space-y-8">
            {/* Session Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {t("training.logSession.sessionDetails", "Session Details")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Day */}
                <div className="w-full">
                  <CustomSelect
                    title={t("training.logSession.day")}
                    options={dayOptions}
                    selectedOption={form.selectedDayName}
                    onChange={(val) => form.setSelectedDayName(val)}
                  />
                </div>

                {/* Date */}
                <InputField
                  label={t("training.logSession.date")}
                  type="date"
                  value={form.sessionDate}
                  onChange={(e) => form.setSessionDate(e.target.value)}
                />
              </div>
            </div>

            {/* Exercises Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                {t("training.logSession.exercises")}
              </h3>

              {form.exercises.length === 0 ? (
                <div className="text-center py-12 text-text-secondary bg-background-secondary rounded-2xl border border-border border-dashed">
                  <Dumbbell size={48} className="mx-auto mb-4 opacity-30" />
                  <p>
                    {t(
                      "training.logSession.noExercises",
                      "No exercises for this day"
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {form.exercises.map((ex, exIndex) => {
                    const originalExercise = currentDay?.exercises[exIndex];

                    return (
                      <SessionExerciseCard
                        key={exIndex}
                        exercise={ex}
                        exerciseIndex={exIndex}
                        originalExercise={originalExercise}
                        onUpdateSet={form.updateSet}
                        onAddSet={form.addSet}
                        onRemoveSet={form.removeSet}
                        onViewVideo={(ex) => setSelectedExercise(ex)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-secondary border-t-2 border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all"
            >
              {t("common.cancel", "Cancel")}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={form.exercises.length === 0 || logSession.isPending}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {logSession.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("common.saving", "Saving...")}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {t("training.logSession.save")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

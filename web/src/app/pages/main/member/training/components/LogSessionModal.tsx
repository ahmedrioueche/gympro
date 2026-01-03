import {
  type ExerciseProgress,
  type ProgramHistory,
} from "@ahmedrioueche/gympro-client";
import { Calendar, Dumbbell, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";
import { useLogSession } from "../../../../../../hooks/queries/useTraining";

interface LogSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeHistory: ProgramHistory;
}

export const LogSessionModal = ({
  isOpen,
  onClose,
  activeHistory,
}: LogSessionModalProps) => {
  const { program, progress } = activeHistory;
  const { t } = useTranslation();
  const [selectedDayName, setSelectedDayName] = useState<string>(
    program.days[0]?.name || ""
  );
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [prevValues, setPrevValues] = useState<
    Record<string, ExerciseProgress>
  >({});

  const logSession = useLogSession();

  // Initialize form when Day changes
  useEffect(() => {
    const day = program.days.find((d) => d.name === selectedDayName);
    if (!day) return;

    const lastSession = progress?.dayLogs
      ? [...progress.dayLogs]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .find((log) => log.dayName === selectedDayName)
      : undefined;

    const initialExercises: ExerciseProgress[] = day.exercises.map((ex) => {
      const lastEx = lastSession?.exercises.find(
        (e) => e.exerciseId === ex._id
      );

      return {
        exerciseId: ex._id,
        setsDone: lastEx?.setsDone ?? ex.recommendedSets,
        repsDone: lastEx?.repsDone ?? ex.recommendedReps,
        weightKg: lastEx?.weightKg ?? 0,
      };
    });

    setExercises(initialExercises);

    if (lastSession) {
      const prevMap: Record<string, ExerciseProgress> = {};
      lastSession.exercises.forEach((ex) => {
        prevMap[ex.exerciseId] = ex;
      });
      setPrevValues(prevMap);
    } else {
      setPrevValues({});
    }
  }, [selectedDayName, program, progress]);

  const handleSave = () => {
    logSession.mutate(
      {
        programId: program._id,
        dayName: selectedDayName,
        date: sessionDate,
        exercises: exercises,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const updateExercise = (
    index: number,
    field: keyof ExerciseProgress,
    value: any
  ) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const getExerciseName = (id: string): string => {
    for (const day of program.days) {
      const ex = day.exercises.find((e) => e._id === id);
      if (ex) return ex.name;
    }
    return t("training.logSession.unknownExercise");
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl max-w-3xl max-h-[90vh] w-full border-2 border-primary/30 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col"
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
          <div className="p-6 space-y-6">
            {/* Session Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {t("training.logSession.sessionDetails", "Session Details")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Day */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    {t("training.logSession.day")}
                  </label>
                  <select
                    value={selectedDayName}
                    onChange={(e) => setSelectedDayName(e.target.value)}
                    className="w-full p-3 bg-background-secondary rounded-xl border border-border text-text-primary outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    {program.days.map((day) => (
                      <option key={day.name} value={day.name}>
                        {day.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <InputField
                  label={t("training.logSession.date")}
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </div>
            </div>

            {/* Exercises Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                {t("training.logSession.exercises")}
              </h3>

              {exercises.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                  <Dumbbell size={48} className="mx-auto mb-4 opacity-30" />
                  <p>
                    {t(
                      "training.logSession.noExercises",
                      "No exercises for this day"
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exercises.map((ex, idx) => {
                    const exerciseName = getExerciseName(ex.exerciseId);
                    const prev = prevValues[ex.exerciseId];

                    return (
                      <div
                        key={idx}
                        className="bg-background-secondary border border-border rounded-xl p-4 space-y-4"
                      >
                        {/* Exercise Name */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <h5 className="font-semibold text-text-primary mb-1">
                              {exerciseName}
                            </h5>
                            {prev && (
                              <span className="text-xs text-text-secondary">
                                {t("training.logSession.last", {
                                  sets: prev.setsDone,
                                  reps: prev.repsDone,
                                  weight: prev.weightKg,
                                })}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Exercise Stats */}
                        <div className="grid grid-cols-3 gap-3">
                          <InputField
                            label={t("training.logSession.sets")}
                            type="number"
                            value={ex.setsDone || ""}
                            onChange={(e) =>
                              updateExercise(
                                idx,
                                "setsDone",
                                parseInt(e.target.value) || 0
                              )
                            }
                            min="0"
                          />
                          <InputField
                            label={t("training.logSession.reps")}
                            type="number"
                            value={ex.repsDone || ""}
                            onChange={(e) =>
                              updateExercise(
                                idx,
                                "repsDone",
                                parseInt(e.target.value) || 0
                              )
                            }
                            min="0"
                          />
                          <InputField
                            label={t("training.logSession.kg")}
                            type="number"
                            value={ex.weightKg || ""}
                            onChange={(e) =>
                              updateExercise(
                                idx,
                                "weightKg",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            min="0"
                            step="0.5"
                          />
                        </div>
                      </div>
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
              disabled={exercises.length === 0 || logSession.isPending}
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

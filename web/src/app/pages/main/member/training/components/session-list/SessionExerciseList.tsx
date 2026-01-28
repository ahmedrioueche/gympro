import {
  type ExerciseProgress,
  type TrainingProgram,
} from "@ahmedrioueche/gympro-client";
import { Dumbbell, PlayCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../../../store/modal";
import { useSessionExercises } from "./useSessionExercises";

interface SessionExerciseListProps {
  exercises: ExerciseProgress[];
  program: TrainingProgram;
  notes?: string;
}

export const SessionExerciseList = ({
  exercises,
  program,
  notes,
}: SessionExerciseListProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { getExerciseName, getExercise } = useSessionExercises(program);

  return (
    <>
      {exercises.map((ex, idx) => {
        const exerciseDef = getExercise(ex.exerciseId);
        const hasVideo = !!exerciseDef?.videoUrl;

        return (
          <div
            key={idx}
            className="bg-surface rounded-lg p-3 border border-border/50"
          >
            <div className="flex items-center justify-start gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Dumbbell size={14} className="text-primary" />
                <span className="font-medium text-text-primary">
                  {getExerciseName(ex.exerciseId)}
                </span>
              </div>
              {hasVideo && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (exerciseDef) {
                      openModal("exercise_detail", { exercise: exerciseDef });
                    }
                  }}
                  className="text-primary hover:text-primary/80 transition-colors"
                  title={t("training.exercise.watchVideo", "Watch Video")}
                >
                  <PlayCircle size={18} />
                </button>
              )}
            </div>
            <div className="pl-6 space-y-1">
              {ex.sets?.length > 0 ? (
                ex.sets.map((set, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-1">
                    <div className="text-xs text-text-secondary flex justify-between max-w-xs">
                      <span>
                        {t("training.page.sessionList.set")} {setIdx + 1}:{" "}
                        {set.reps} {t("training.page.sessionList.reps")}
                      </span>
                      <span>
                        {set.weight} {t("training.page.sessionList.kg")}
                      </span>
                    </div>
                    {/* Drop Sets */}
                    {set.drops && set.drops.length > 0 && (
                      <div className="pl-2 space-y-1 border-l-2 border-error/20 ml-1">
                        {set.drops.map((drop, dropIdx) => (
                          <div
                            key={dropIdx}
                            className="text-[10px] text-text-secondary/80 flex justify-between max-w-xs items-center"
                          >
                            <div className="flex items-center gap-1">
                              <span className="text-error font-bold uppercase text-[9px]">
                                Drop
                              </span>
                              <span>
                                {drop.reps}{" "}
                                {t("training.page.sessionList.reps")}
                              </span>
                            </div>
                            <span>
                              {drop.weight} {t("training.page.sessionList.kg")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-text-secondary italic">
                  {t("training.page.sessionList.noSets")}
                </div>
              )}
            </div>
          </div>
        );
      })}
      {notes && (
        <div className="mt-2 pt-2 border-t border-dashed border-border text-xs text-text-secondary italic">
          "{notes}"
        </div>
      )}
    </>
  );
};

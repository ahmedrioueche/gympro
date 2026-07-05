import { Dumbbell } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import {
  useAutoSaveSession,
  useLogSession,
} from "../../../../../../../hooks/queries/useTraining";
import { useModalStore } from "../../../../../../../store/modal";
import { useModalLayer } from "../../../../../../../hooks/useModalLayer";
import { SessionBlock } from "./SessionBlock";
import { SessionExerciseCard } from "./SessionExerciseCard";
import { AddSessionExercise } from "./AddSessionExercise";
import { SessionProgressFooter } from "./SessionProgressFooter";
import { useSessionForm } from "./useSessionForm";
import { WorkoutCompleteCelebration } from "./WorkoutCompleteCelebration";

const LogSessionModalContent = ({
  activeHistory,
  initialSession,
  mode,
  closeModal,
  zIndex,
}: {
  activeHistory: any;
  initialSession: any;
  mode: "new" | "edit";
  closeModal: () => void;
  zIndex: number;
}) => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const logSession = useLogSession();
  const autoSaveSession = useAutoSaveSession();
  const [celebration, setCelebration] = useState<{
    dayName: string;
    completedSets: number;
    totalSets: number;
  } | null>(null);

  const handleCelebrationClose = useCallback(() => {
    setCelebration(null);
    closeModal();
  }, [closeModal]);
  const handleAutoSave = async (data: any) => {
    try {
      const result = await autoSaveSession.mutateAsync(data);
      if (!data.sessionId) {
        const responseBody = (result as any).data || result;
        const historyData = responseBody.data || responseBody;

        if (!historyData?.progress?.dayLogs) {
          console.error("Auto-save: Could not parse history data", historyData);
          return undefined;
        }

        const logs = historyData.progress.dayLogs;
        let targetLog: any;

        if (data.submissionId) {
          targetLog = logs.find(
            (l: any) => l.submissionId === data.submissionId,
          );
        }

        return targetLog?._id;
      }
      return data.sessionId;
    } catch (error) {
      console.error("Auto-save failed", error);
      return undefined;
    }
  };

  const form = useSessionForm({
    isOpen: true, // Known true if this component is mounted
    activeHistory: activeHistory!,
    initialSession,
    mode: mode || "new",
    onAutoSave: handleAutoSave,
  });

  const initialScrollDoneRef = useRef(false);

  useEffect(() => {
    if (form.exercises.length === 0) return;

    let lastCompleted: { exIndex: number; setIndex: number } | null = null;
    form.exercises.forEach((exercise, exIndex) => {
      exercise.sets.forEach((set, setIndex) => {
        if (set.completed) {
          lastCompleted = { exIndex, setIndex };
        }
      });
    });

    if (!initialScrollDoneRef.current && lastCompleted) {
      initialScrollDoneRef.current = true;
      requestAnimationFrame(() => {
        const el = document.getElementById(
          `session-set-${lastCompleted!.exIndex}-${lastCompleted!.setIndex}`,
        );
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, [form.exercises]);

  useEffect(() => {
    if (!form.scrollToSet) return;

    const { exIndex, setIndex } = form.scrollToSet;
    requestAnimationFrame(() => {
      const el = document.getElementById(`session-set-${exIndex}-${setIndex}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      form.clearScrollToSet();
    });
  }, [form.scrollToSet, form.clearScrollToSet]);

  const { program } = activeHistory;

  const handleRemoveExercise = useCallback(
    (exIndex: number) => {
      const display = form.getSessionExerciseDisplay(exIndex);
      const exerciseName =
        display?.name || t("training.logSession.unknownExercise");

      openModal("confirm", {
        title: t("training.logSession.removeExerciseTitle"),
        text: t("training.logSession.removeExerciseMessage", {
          name: exerciseName,
        }),
        confirmText: t("training.logSession.removeExerciseConfirm"),
        confirmVariant: "danger",
        onConfirm: () => form.removeSessionExercise(exIndex),
      });
    },
    [form, openModal, t],
  );

  const handleSave = () => {
    const validationError = form.validateSession();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const durationMinutes = form.finalizeSessionTimer();

    let completedSets = 0;
    let totalSets = 0;
    form.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        totalSets++;
        if (set.completed) completedSets++;
      });
    });

    logSession.mutate(
      {
        programId: program._id!,
        dayName: form.selectedDayName,
        date: form.sessionDate,
        durationMinutes,
        exercises: form.exercises,
        sessionId:
          mode === "edit"
            ? (initialSession as any)?._id || (initialSession as any)?.id
            : form.serverSessionId,
        submissionId: form.submissionId,
        silent: true,
      },
      {
        onSuccess: () => {
          form.markAsSaved();
          const isFullyComplete = totalSets > 0 && completedSets === totalSets;
          if (isFullyComplete) {
            setCelebration({
              dayName: form.selectedDayName,
              completedSets,
              totalSets,
            });
          } else {
            closeModal();
          }
        },
      },
    );  };

  const currentDay = program.days.find((d) => d.name === form.selectedDayName);

  const dayOptions = program.days.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  return (
    <>
      <BaseModal
        isOpen={!celebration}
        zIndex={zIndex}
        onClose={closeModal}      title={t("training.logSession.title")}
      subtitle={`${program.name} - ${form.selectedDayName}`}
      icon={Dumbbell}
      maxWidth="max-w-4xl"
      showFooter={true}
      footer={
        <SessionProgressFooter
          exercises={form.exercises}
          onDone={handleSave}
          isSaving={logSession.isPending}
          isAutoSaving={form.isAutoSaving}
          showSavedIndicator={form.showSavedIndicator}
          sessionTimerFormattedElapsed={form.sessionTimerFormattedElapsed}
          sessionTimerIsRunning={form.sessionTimerIsRunning}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("training.logSession.selectDay")}
            </label>
            <CustomSelect
              title=""
              options={dayOptions}
              selectedOption={form.selectedDayName}
              onChange={(val) => form.setSelectedDayName(val as string)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("training.logSession.date")}
            </label>
            <InputField
              type="datetime-local"
              value={form.sessionDate}
              onChange={(e) => form.setSessionDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Dumbbell size={20} className="text-primary" />
            {t("training.logSession.exercises")}
          </h3>
          <div className="space-y-3">
            {form.sessionLayout.length === 0 ? (
              <p className="text-center text-text-secondary py-8">
                {t("training.logSession.noExercises")}
              </p>
            ) : (
              form.sessionLayout.map((entry) => {
                if (entry.kind === "program-block") {
                  const block = currentDay?.blocks[entry.blockIndex];
                  if (!block) return null;

                  const blockExercises = entry.exerciseIndices.map(
                    (i) => form.exercises[i],
                  );
                  const isSplit =
                    form.splitBlockIndices?.has(entry.blockIndex) ?? false;

                  return (
                    <SessionBlock
                      key={`block-${entry.blockIndex}`}
                      block={block}
                      exercises={blockExercises}
                      exerciseIndices={entry.exerciseIndices}
                      isSplit={isSplit}
                      onToggleSplit={() =>
                        form.toggleBlockSplit(entry.blockIndex)
                      }
                      onUpdateSet={form.updateSet}
                      onCommitSetWeight={form.commitSetWeight}
                      onAddSet={form.addSet}
                      onRemoveSet={form.removeSet}
                      onAddDropSet={form.addDropSet}
                      onUpdateDropSet={form.updateDropSet}
                      onRemoveDropSet={form.removeDropSet}
                      onViewVideo={(ex) =>
                        openModal("exercise_detail", { exercise: ex })
                      }
                      onToggleSupersetCompletion={
                        form.toggleSupersetCompletion
                      }
                      onRemoveExercise={handleRemoveExercise}
                    />
                  );
                }

                const exercise = form.exercises[entry.exerciseIndex];
                if (!exercise) return null;

                const display = form.getSessionExerciseDisplay(
                  entry.exerciseIndex,
                );

                return (
                  <SessionExerciseCard
                    key={`added-${entry.exerciseIndex}`}
                    exercise={exercise}
                    exerciseIndex={entry.exerciseIndex}
                    originalExercise={
                      display
                        ? {
                            name: display.name,
                            videoUrl: display.videoUrl,
                          }
                        : undefined
                    }
                    onUpdateSet={form.updateSet}
                    onCommitSetWeight={form.commitSetWeight}
                    onAddSet={form.addSet}
                    onRemoveSet={form.removeSet}
                    onAddDropSet={form.addDropSet}
                    onUpdateDropSet={form.updateDropSet}
                    onRemoveDropSet={form.removeDropSet}
                    onViewVideo={(ex) =>
                      openModal("exercise_detail", { exercise: ex })
                    }
                    onRemoveExercise={() =>
                      handleRemoveExercise(entry.exerciseIndex)
                    }
                  />
                );
              })
            )}
            <AddSessionExercise onAdd={form.addSessionExercise} />
          </div>
        </div>
      </div>
    </BaseModal>

      {celebration && (
        <WorkoutCompleteCelebration
          dayName={celebration.dayName}
          completedSets={celebration.completedSets}
          totalSets={celebration.totalSets}
          onClose={handleCelebrationClose}
        />
      )}
    </>
  );
};
export const LogSessionModal = () => {
  const { logSessionProps, closeModal } = useModalStore();
  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("log_session");

  if (!isOpen || !logSessionProps?.activeHistory) return null;

  const { activeHistory, initialSession, mode } = logSessionProps;

  return (
    <LogSessionModalContent
      activeHistory={activeHistory}
      initialSession={initialSession}
      mode={mode || "new"}
      closeModal={closeModal}
      zIndex={zIndex}
    />
  );
};

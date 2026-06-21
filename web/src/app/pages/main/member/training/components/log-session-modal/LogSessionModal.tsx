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

  const handleSave = () => {
    const validationError = form.validateSession();
    if (validationError) {
      toast.error(validationError);
      return;
    }

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
        durationMinutes: form.durationMinutes,
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
          setCelebration({
            dayName: form.selectedDayName,
            completedSets,
            totalSets,
          });
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
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("training.logSession.duration")}
            </label>
            <InputField
              type="number"
              placeholder="45"
              value={form.durationMinutes}
              onChange={(e) =>
                form.setDurationMinutes(parseInt(e.target.value) || 0)
              }
              rightIcon={
                <span className="text-xs font-bold text-text-secondary uppercase">
                  min
                </span>
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Dumbbell size={20} className="text-primary" />
            {t("training.logSession.exercises")}
          </h3>
          <div className="space-y-3">
            {form.exercises.length === 0 ? (
              <p className="text-center text-text-secondary py-8">
                {t("training.logSession.noExercises")}
              </p>
            ) : (
              currentDay?.blocks.map((block, blockIndex) => {
                const startIndex = currentDay.blocks
                  .slice(0, blockIndex)
                  .reduce((acc, b) => acc + b.exercises.length, 0);

                const blockExercises = form.exercises.slice(
                  startIndex,
                  startIndex + block.exercises.length,
                );

                const isSplit =
                  form.splitBlockIndices?.has(blockIndex) ?? false;

                return (
                  <SessionBlock
                    key={blockIndex}
                    block={block}
                    exercises={blockExercises}
                    startIndex={startIndex}
                    isSplit={isSplit}
                    onToggleSplit={() => form.toggleBlockSplit(blockIndex)}
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
                    onToggleSupersetCompletion={form.toggleSupersetCompletion}
                  />
                );
              })
            )}
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

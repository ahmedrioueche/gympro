import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import {
  useAutoSaveSession,
  useLogSession,
} from "../../../../../../../hooks/queries/useTraining";
import { useModalStore } from "../../../../../../../store/modal";
import { SessionBlock } from "./SessionBlock";
import { SessionProgressFooter } from "./SessionProgressFooter";
import { useSessionForm } from "./useSessionForm";

export const LogSessionModal = () => {
  const { t } = useTranslation();
  const { currentModal, logSessionProps, closeModal, openModal } =
    useModalStore();
  const isOpen = currentModal === "log_session";

  const { activeHistory, initialSession, mode } = logSessionProps || {};

  const logSession = useLogSession();
  const autoSaveSession = useAutoSaveSession();

  const handleAutoSave = async (data: any) => {
    try {
      const result = await autoSaveSession.mutateAsync(data);
      // If we didn't have a sessionId, finding the new one
      if (!data.sessionId) {
        // Find the matching log inside result (ProgramHistory)
        // Access result.data because Axios/API wrapper returns data property.
        // AND check for 'data' property inside that if apiResponse wrapper is used.
        const responseBody = (result as any).data || result;
        const historyData = responseBody.data || responseBody; // unwrapping apiResponse { data: ... }

        if (!historyData?.progress?.dayLogs) {
          console.error("Auto-save: Could not parse history data", historyData);
          return undefined;
        }

        // Since we just PUSHED a new log, it is guaranteed to be the last one in the array.
        // BUT if we updated an existing one, it might be anywhere.
        const logs = historyData.progress.dayLogs;

        let targetLog: any;

        // Priority 1: Match by submissionId
        if (data.submissionId) {
          targetLog = logs.find(
            (l: any) => l.submissionId === data.submissionId,
          );
        }

        // Priority 2: Match by Day + Date (take the last one matching to be safe)
        if (!targetLog) {
          const targetDateStr = new Date(data.date).toISOString().split("T")[0];
          const matches = logs.filter(
            (l: any) =>
              l.dayName === data.dayName &&
              new Date(l.date).toISOString().split("T")[0] === targetDateStr,
          );
          targetLog = matches[matches.length - 1];
        }

        // Fallback: Last log
        if (!targetLog) {
          targetLog = logs[logs.length - 1];
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
    isOpen,
    activeHistory: activeHistory!,
    initialSession,
    mode: mode || "new",
    onAutoSave: handleAutoSave,
  });

  if (!isOpen || !activeHistory) return null;

  const { program } = activeHistory;

  const handleSave = () => {
    // Final save / Done
    logSession.mutate(
      {
        programId: program._id!,
        dayName: form.selectedDayName,
        date: form.sessionDate,
        exercises: form.exercises,
        sessionId:
          mode === "edit"
            ? (initialSession as any)?._id || (initialSession as any)?.id
            : (form as any).serverSessionId,
      } as any,
      {
        onSuccess: () => {
          form.markAsSaved(); // Clear localStorage after successful save
          closeModal();
        },
      },
    );
  };

  const currentDay = program.days.find((d) => d.name === form.selectedDayName);
  const flattenedExercises =
    currentDay?.blocks.flatMap((b) => b.exercises) || [];

  const dayOptions = program.days.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("training.logSession.title")}
      subtitle={`${program.name} - ${form.selectedDayName}`}
      icon={Dumbbell}
      maxWidth="max-w-4xl"
      showFooter={true}
      footer={
        <SessionProgressFooter
          exercises={form.exercises}
          onDone={handleSave}
          isSaving={logSession.isPending}
        />
      }
    >
      <div className="space-y-6">
        {/* Day and Date Selection */}
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
              type="date"
              value={form.sessionDate}
              onChange={(e) => form.setSessionDate(e.target.value)}
            />
          </div>
        </div>

        {/* Exercises */}
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
                // Determine which exercises belong to this block
                // We need to calculate the start index based on previous blocks
                const startIndex = currentDay.blocks
                  .slice(0, blockIndex)
                  .reduce((acc, b) => acc + b.exercises.length, 0);

                const blockExercises = form.exercises.slice(
                  startIndex,
                  startIndex + block.exercises.length,
                );

                const isSplit =
                  form.splitBlockIndices?.has(blockIndex) ?? false;

                // Import SessionBlock at top level, but assuming local here for diff context
                // Need to ensure SessionBlock is imported in file.
                // Assuming it will be imported. if not, I'll add import in next step or user context.
                // Wait, I cannot add import here easily without multi-replace.
                // I will assume I need to add import separately or use multi-replace.
                // Let's use SessionBlock assuming it's imported (I will add import next).

                return (
                  // @ts-ignore - SessionBlock import to be added
                  <SessionBlock
                    key={blockIndex}
                    block={block}
                    exercises={blockExercises}
                    startIndex={startIndex}
                    isSplit={isSplit}
                    onToggleSplit={() => form.toggleBlockSplit(blockIndex)}
                    onUpdateSet={form.updateSet}
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
  );
};

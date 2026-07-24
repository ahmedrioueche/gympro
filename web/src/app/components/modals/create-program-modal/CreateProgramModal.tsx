import { ArrowLeft, ArrowRight, Check, Dumbbell, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { AutoSaveIndicator } from "../../../../components/ui/AutoSaveIndicator";
import { useLanguageStore } from "../../../../store/language";
import { useModalStore } from "../../../../store/modal";
import { useModalLayer } from "../../../../hooks/useModalLayer";
import { useProgramCreate } from "../../../hooks/useProgramCreate";
import { DayCard } from "../../gym/DayCard";
import { BasicInfoForm } from "./BasicInfoForm";

export const CreateProgramModal = ({}) => {
  const { closeModal } = useModalStore();
  const { t } = useTranslation();
  const {
    step,
    setStep,
    formData,
    programId,
    isSaving,
    isAutoSaving,
    showSavedIndicator,
    handleNext,
    updateDayName,
    addExercise,
    updateExercise,
    removeExercise,
    reorderBlock,
    groupBlocks,
    updateField,
    updateDaysPerWeek,
  } = useProgramCreate(closeModal);
  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("create_program");
  const { isRtl } = useLanguageStore();

  const renderFooter = () => (
    <div className="flex flex-col gap-3 w-full">
      {programId && (
        <div className="flex justify-center sm:justify-end">
          <AutoSaveIndicator
            isAutoSaving={isAutoSaving}
            showSavedIndicator={showSavedIndicator}
          />
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => (step === 1 ? closeModal() : setStep(1))}
          disabled={isSaving}
          className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {step === 1 ? (
            <>
              <X className="w-5 h-5" />
              {t("common.cancel")}
            </>
          ) : (
            <>
              {isRtl ? (
                <ArrowLeft className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
              {t("common.back")}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => void handleNext()}
          disabled={isSaving}
          className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("common.saving")}
            </>
          ) : step === 1 ? (
            <>
              {t("training.programs.create.next")}
              {isRtl ? (
                <ArrowLeft className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              {t("training.logSession.done")}
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen} zIndex={zIndex}
      onClose={closeModal}
      title={
        step === 1
          ? t("training.programs.create.title")
          : t("training.programs.create.schedule")
      }
      subtitle={
        step === 1
          ? t("training.programs.create.subtitle")
          : t("training.programs.create.scheduleSubtitle")
      }
      icon={Dumbbell}
      footer={renderFooter()}
    >
      <div className="space-y-6">
        {step === 1 ? (
          <BasicInfoForm
            formData={formData}
            onFieldChange={updateField}
            onDaysPerWeekChange={updateDaysPerWeek}
          />
        ) : (
          <div className="space-y-4">
            {formData.days.map((day, dayIndex) => (
              <DayCard
                key={dayIndex}
                day={day}
                dayIndex={dayIndex}
                isEditMode={true}
                onDayNameChange={(name) => updateDayName(dayIndex, name)}
                onAddExercise={(data) => addExercise(dayIndex, data)}
                onExerciseUpdate={(blockIndex, exIndex, field, value) =>
                  updateExercise(dayIndex, blockIndex, exIndex, field, value)
                }
                onExerciseRemove={(blockIndex, exIndex) =>
                  removeExercise(dayIndex, blockIndex, exIndex)
                }
                onBlockReorder={(fromIndex, toIndex) =>
                  reorderBlock(dayIndex, fromIndex, toIndex)
                }
                onGroupBlocks={(blockIndices) =>
                  groupBlocks(dayIndex, blockIndices)
                }
                onExerciseClick={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  );
};
export default CreateProgramModal;

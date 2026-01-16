import { Dumbbell, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { useModalStore } from "../../../../store/modal";
import { useProgramCreate } from "../../../hooks/useProgramCreate";
import { DayCard } from "../../gym/DayCard";
import { BasicInfoForm } from "./BasicInfoForm";

export const CreateProgramModal = ({}) => {
  const { currentModal, closeModal } = useModalStore();
  const { t } = useTranslation();
  const {
    step,
    setStep,
    formData,
    createProgram,
    handleNext,
    updateDayName,
    addExercise,
    updateExercise,
    removeExercise,
    reorderExercise,
    updateField,
    updateDaysPerWeek,
  } = useProgramCreate(closeModal);
  const isOpen = currentModal === "create_program";

  const renderFooter = () => (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => (step === 1 ? closeModal() : setStep(1))}
        disabled={createProgram.isPending}
        className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all disabled:opacity-50"
      >
        {step === 1 ? t("common.cancel") : t("common.back")}
      </button>
      <button
        type="button"
        onClick={handleNext}
        disabled={createProgram.isPending}
        className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {createProgram.isPending ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t("common.saving")}
          </>
        ) : step === 1 ? (
          <>{t("training.programs.create.next")}</>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            {t("training.programs.create.submit")}
          </>
        )}
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
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
                onExerciseUpdate={(exIndex, field, value) =>
                  updateExercise(dayIndex, exIndex, field, value)
                }
                onExerciseRemove={(exIndex) =>
                  removeExercise(dayIndex, exIndex)
                }
                onExerciseReorder={(fromIndex, toIndex) =>
                  reorderExercise(dayIndex, fromIndex, toIndex)
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

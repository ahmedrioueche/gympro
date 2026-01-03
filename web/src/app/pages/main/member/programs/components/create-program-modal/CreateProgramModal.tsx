import { BasicInfoForm } from "./BasicInfoForm";
import { CreateFooter } from "./CreateFooter";
import { CreateHeader } from "./CreateHeader";
import { DayScheduleCard } from "./DayScheduleCard";
import { useProgramCreate } from "./useProgramCreate";

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProgramModal = ({
  isOpen,
  onClose,
}: CreateProgramModalProps) => {
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
    updateField,
    updateDaysPerWeek,
  } = useProgramCreate(onClose);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl max-w-3xl max-h-[99vh] w-full border-2 border-primary/30 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col"
      >
        <CreateHeader step={step} onClose={onClose} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="p-6 space-y-6">
            {step === 1 ? (
              <BasicInfoForm
                formData={formData}
                onFieldChange={updateField}
                onDaysPerWeekChange={updateDaysPerWeek}
              />
            ) : (
              <div className="space-y-4">
                {formData.days.map((day, dayIndex) => (
                  <DayScheduleCard
                    key={dayIndex}
                    day={day}
                    dayIndex={dayIndex}
                    onDayNameChange={(name) => updateDayName(dayIndex, name)}
                    onAddExercise={() => addExercise(dayIndex)}
                    onExerciseUpdate={(exIndex, field, value) =>
                      updateExercise(dayIndex, exIndex, field, value)
                    }
                    onExerciseRemove={(exIndex) =>
                      removeExercise(dayIndex, exIndex)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <CreateFooter
          step={step}
          isSaving={createProgram.isPending}
          onBack={() => (step === 1 ? onClose() : setStep(1))}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

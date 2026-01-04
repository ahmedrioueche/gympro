import type { TrainingProgram } from "@ahmedrioueche/gympro-client";
import { Dumbbell } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DayCard,
  ModalFooter,
  ModalHeader,
  ProgramDescription,
  ProgramForm,
} from ".";
import { ExerciseDetailModal } from "../../../../../../components/gym/ExerciseDetailModal";
import { useProgramEdit } from "./useProgramEdit";

interface ProgramDetailsModalProps {
  program: TrainingProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onUse: (programId: string) => void;
  onProgramUpdated?: (program: TrainingProgram) => void;
}

export const ProgramDetailsModal = ({
  program,
  isOpen,
  onClose,
  onUse,
  onProgramUpdated,
}: ProgramDetailsModalProps) => {
  const { t } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    editData,
    setEditData,
    updateProgram,
    handleSave,
    updateDayName,
    addExercise,
    updateExercise,
    removeExercise,
  } = useProgramEdit(program, isEditMode, onProgramUpdated);

  const handleSaveClick = () => {
    handleSave();
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  if (!isOpen || !program) return null;

  const displayData = isEditMode && editData ? editData : program;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-surface rounded-2xl shadow-2xl max-w-3xl max-h-[99vh] w-full border-2 border-primary/30 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col"
        >
          <ModalHeader
            program={program}
            isEditMode={isEditMode}
            editName={editData?.name}
            onEditNameChange={(name) => setEditData({ ...editData, name })}
            onEditClick={() => setIsEditMode(true)}
            onClose={onClose}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="p-6 space-y-6">
              <ProgramDescription
                description={program.description}
                isEditMode={isEditMode}
                editDescription={editData?.description}
                onDescriptionChange={(description) =>
                  setEditData({ ...editData, description })
                }
              />

              {isEditMode && (
                <ProgramForm
                  experience={editData?.experience || "beginner"}
                  purpose={editData?.purpose || "general_fitness"}
                  onExperienceChange={(experience) =>
                    setEditData({ ...editData, experience })
                  }
                  onPurposeChange={(purpose) =>
                    setEditData({ ...editData, purpose })
                  }
                />
              )}

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  {t("training.programs.create.schedule")}
                </h3>

                <div className="grid gap-4">
                  {(displayData.days || []).map((day, index) => (
                    <DayCard
                      key={index}
                      day={day}
                      dayIndex={index}
                      isEditMode={isEditMode}
                      onDayNameChange={(name) => updateDayName(index, name)}
                      onAddExercise={() => addExercise(index)}
                      onExerciseUpdate={(exIndex, field, value) =>
                        updateExercise(index, exIndex, field, value)
                      }
                      onExerciseRemove={(exIndex) =>
                        removeExercise(index, exIndex)
                      }
                      onExerciseClick={setSelectedExercise}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ModalFooter
            isEditMode={isEditMode}
            isSaving={updateProgram.isPending}
            programId={program._id!}
            onSave={handleSaveClick}
            onCancel={handleCancel}
            onClose={onClose}
            onUse={onUse}
          />
        </div>
      </div>

      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
};

import { type ProgramComment } from "@ahmedrioueche/gympro-client";
import { Dumbbell, Check, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DayCard, ProgramDescription, ProgramForm } from ".";
import BaseModal from "../../../../components/ui/BaseModal";
import { AutoSaveIndicator } from "../../../../components/ui/AutoSaveIndicator";
import { useModalStore } from "../../../../store/modal";
import { useModalLayer } from "../../../../hooks/useModalLayer";
import { useUserStore } from "../../../../store/user";
import { useProgramEdit } from "../../../hooks/useProgramEdit";
import AddReviewForm from "./AddReviewForm";
import ReviewList from "./ReviewList";

const ProgramDetailsModal = ({}) => {
  const { programDetailsProps, closeModal } = useModalStore();
  const { user } = useUserStore();
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("program_details");
  const program = programDetailsProps?.program;
  const onProgramUpdated = programDetailsProps?.onProgramUpdated;
  const onUse = programDetailsProps?.onUse;
  const isActive = programDetailsProps?.isActive;

  // Local state for optimistic comment updates
  const [localComments, setLocalComments] = useState<ProgramComment[]>([]);

  // Sync local comments with program comments when program changes
  useEffect(() => {
    setLocalComments(program?.comments || []);
  }, [program?.comments]);

  const {
    editData,
    patchEditData,
    updateProgram,
    finishEditing,
    updateDayName,
    addExercise,
    updateExercise,
    removeExercise,
    reorderBlock,
    groupBlocks,
    isAutoSaving,
    showSavedIndicator,
  } = useProgramEdit(program, isEditMode, onProgramUpdated);

  const handleDoneClick = async () => {
    await finishEditing();
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  if (!program) return null;

  const displayData = isEditMode && editData ? editData : program;

  // Custom footer based on edit mode
  const renderFooter = () => (
    <div className="flex flex-col gap-3 w-full">
      {isEditMode && (
        <div className="flex justify-center sm:justify-end">
          <AutoSaveIndicator
            isAutoSaving={isAutoSaving || updateProgram.isPending}
            showSavedIndicator={showSavedIndicator}
          />
        </div>
      )}

      <div className="flex gap-3">
      {isEditMode ? (
        <>
          <button
            type="button"
            onClick={handleCancel}
            disabled={updateProgram.isPending || isAutoSaving}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={() => void handleDoneClick()}
            disabled={updateProgram.isPending || isAutoSaving}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {updateProgram.isPending || isAutoSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("common.saving")}
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                {t("training.logSession.done")}
              </>
            )}
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            {t("common.close")}
          </button>
          <button
            type="button"
            onClick={() => {
              onUse(program._id!);
              closeModal();
            }}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/80 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Dumbbell className="w-5 h-5" />
            {isActive
              ? t("training.programs.details.continue")
              : t("training.programs.details.start")}
          </button>
        </>
      )}
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen} zIndex={zIndex}
      onClose={closeModal}
      title={program.name}
      subtitle={`${program.experience} • ${t(
        "training.programs.card.daysPerWeek",
        {
          count: program.daysPerWeek,
        },
      )}`}
      icon={Dumbbell}
      isEditMode={isEditMode}
      editTitle={editData?.name}
      onTitleChange={(name) => patchEditData({ name })}
      onEditClick={() => setIsEditMode(true)}
      showEditButton={
        program.creationType === "member" && program.createdBy === user?._id
      }
      footer={renderFooter()}
    >
      <div className="space-y-6">
        <ProgramDescription
          description={program.description}
          isEditMode={isEditMode}
          editDescription={editData?.description}
          onDescriptionChange={(description) =>
            patchEditData({ description })
          }
        />

        {isEditMode && (
          <ProgramForm
            experience={editData?.experience || "beginner"}
            purpose={editData?.purpose || "general_fitness"}
            daysPerWeek={editData?.daysPerWeek}
            durationWeeks={editData?.durationWeeks || 12}
            onExperienceChange={(experience) =>
              patchEditData({ experience })
            }
            onPurposeChange={(purpose) => patchEditData({ purpose })}
            onDaysPerWeekChange={(daysPerWeek) =>
              patchEditData({ daysPerWeek })
            }
            onDurationWeeksChange={(durationWeeks) =>
              patchEditData({ durationWeeks })
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
                onExerciseUpdate={(blockIndex, exIndex, field, value) =>
                  updateExercise(index, blockIndex, exIndex, field, value)
                }
                onExerciseRemove={(blockIndex, exIndex) =>
                  removeExercise(index, blockIndex, exIndex)
                }
                onBlockReorder={(fromIndex, toIndex) =>
                  reorderBlock(index, fromIndex, toIndex)
                }
                onGroupBlocks={(blockIndices) =>
                  groupBlocks(index, blockIndices)
                }
                onExerciseClick={(ex) =>
                  openModal("exercise_detail", { exercise: ex })
                }
              />
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        {!isEditMode && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              {t("training.programs.details.reviews.title")}
            </h3>

            {/* Add Review Form */}
            <div className="bg-background-secondary border border-border rounded-xl p-4">
              <h4 className="font-medium text-text-primary text-sm mb-3">
                {t("training.programs.details.reviews.writeReview")}
              </h4>
              <AddReviewForm
                programId={program._id!}
                onOptimisticAdd={(comment) => {
                  setLocalComments((prev) => [comment, ...prev]);
                }}
              />
            </div>

            <ReviewList comments={localComments || []} />
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default ProgramDetailsModal;

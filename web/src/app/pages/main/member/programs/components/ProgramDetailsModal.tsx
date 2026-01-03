import {
  type CreateExerciseDto,
  type CreateProgramDayDto,
  EXPERIENCE_LEVELS,
  type ExperienceLevel,
  PROGRAM_PURPOSES,
  type ProgramPurpose,
  type TrainingProgram,
} from "@ahmedrioueche/gympro-client";
import {
  Calendar,
  ChevronRight,
  Dumbbell,
  Edit3,
  PlayCircle,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../components/ui/InputField";
import { useUpdateProgram } from "../../../../../../hooks/queries/useTraining";
import { ExerciseDetailModal } from "../../components/ExerciseDetailModal";

interface ProgramDetailsModalProps {
  program: TrainingProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onUse: (programId: string) => void;
}

export const ProgramDetailsModal = ({
  program,
  isOpen,
  onClose,
  onUse,
}: ProgramDetailsModalProps) => {
  const { t } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const updateProgram = useUpdateProgram();

  // Initialize edit data when program changes or edit mode is entered
  useEffect(() => {
    if (program && isEditMode) {
      setEditData({
        name: program.name,
        description: program.description,
        experience: program.experience,
        purpose: program.purpose,
        daysPerWeek: program.daysPerWeek,
        days: program.days.map((day) => ({
          name: day.name,
          exercises: day.exercises.map((ex) => ({ ...ex })),
        })),
        isPublic: program.isPublic,
      });
    }
  }, [program, isEditMode]);

  const handleSave = () => {
    if (!editData || !program?._id) return;

    updateProgram.mutate(
      { id: program._id, data: editData },
      {
        onSuccess: () => {
          toast.success(t("training.programs.edit.success"));
          setIsEditMode(false);
          setEditData(null);
        },
        onError: () => {
          toast.error(t("training.programs.edit.error"));
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditData(null);
  };

  const updateDayName = (index: number, name: string) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    newDays[index] = { ...newDays[index], name };
    setEditData({ ...editData, days: newDays });
  };

  const addExercise = (dayIndex: number) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    newDays[dayIndex] = {
      ...newDays[dayIndex],
      exercises: [
        ...newDays[dayIndex].exercises,
        {
          name: "",
          recommendedSets: 3,
          recommendedReps: 10,
          targetMuscles: [],
          equipment: [],
        } as CreateExerciseDto,
      ],
    };
    setEditData({ ...editData, days: newDays });
  };

  const updateExercise = (
    dayIndex: number,
    exIndex: number,
    field: keyof CreateExerciseDto,
    value: any
  ) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    const newExercises = [...newDays[dayIndex].exercises];
    newExercises[exIndex] = { ...newExercises[exIndex], [field]: value };
    newDays[dayIndex] = { ...newDays[dayIndex], exercises: newExercises };
    setEditData({ ...editData, days: newDays });
  };

  const removeExercise = (dayIndex: number, exIndex: number) => {
    if (!editData?.days) return;
    const newDays = [...editData.days] as CreateProgramDayDto[];
    const newExercises = newDays[dayIndex].exercises.filter(
      (_, i) => i !== exIndex
    );
    newDays[dayIndex] = { ...newDays[dayIndex], exercises: newExercises };
    setEditData({ ...editData, days: newDays });
  };

  const experienceOptions = EXPERIENCE_LEVELS.map((level) => ({
    value: level,
    label: level.charAt(0).toUpperCase() + level.slice(1).replace("_", " "),
  }));

  const purposeOptions = PROGRAM_PURPOSES.map((purpose) => ({
    value: purpose,
    label:
      purpose.charAt(0).toUpperCase() + purpose.slice(1).replace(/_/g, " "),
  }));

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
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editData?.name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="text-2xl font-bold text-white bg-white/20 rounded-lg px-3 py-1 border border-white/30 outline-none focus:border-white/50 mb-1"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {program.name}
                    </h2>
                  )}
                  <p className="text-white/90 text-sm capitalize">
                    {program.experience} •{" "}
                    {t("training.programs.card.daysPerWeek", {
                      count: program.daysPerWeek,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditMode && program.creationType === "member" && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    title={t("common.edit")}
                  >
                    <Edit3 className="w-5 h-5 text-white" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="p-6 space-y-6">
              {/* Description */}
              {isEditMode ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    {t("training.programs.create.form.description")}
                  </label>
                  <textarea
                    value={editData?.description || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    placeholder={t(
                      "training.programs.create.form.descriptionPlaceholder"
                    )}
                    rows={3}
                    className="w-full p-3 bg-background-secondary rounded-xl border border-border text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                </div>
              ) : (
                <p className="text-text-secondary leading-relaxed">
                  {program.description ||
                    t("training.programs.card.noDescription")}
                </p>
              )}

              {/* Program Details (Edit Mode) */}
              {isEditMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    title={t("training.programs.create.form.experience")}
                    options={experienceOptions}
                    selectedOption={editData?.experience || "beginner"}
                    onChange={(value) =>
                      setEditData({
                        ...editData,
                        experience: value as ExperienceLevel,
                      })
                    }
                  />
                  <CustomSelect
                    title={t("training.programs.create.form.purpose")}
                    options={purposeOptions}
                    selectedOption={editData?.purpose || "general_fitness"}
                    onChange={(value) =>
                      setEditData({
                        ...editData,
                        purpose: value as ProgramPurpose,
                      })
                    }
                  />
                </div>
              )}

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  {t("training.programs.create.schedule")}
                </h3>

                <div className="grid gap-4">
                  {(displayData.days || []).map((day, index) => (
                    <div
                      key={index}
                      className="bg-background-secondary border border-border rounded-xl overflow-hidden"
                    >
                      <div className="bg-background-tertiary p-3 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          {isEditMode ? (
                            <InputField
                              value={day.name}
                              onChange={(e) =>
                                updateDayName(index, e.target.value)
                              }
                              placeholder={`${t(
                                "training.programs.create.form.day"
                              )} ${index + 1}`}
                            />
                          ) : (
                            <span className="font-medium text-text-primary">
                              {t("training.programs.create.form.dayName")}{" "}
                              {index + 1}: {day.name}
                            </span>
                          )}
                        </div>
                        {isEditMode && (
                          <button
                            onClick={() => addExercise(index)}
                            className="px-3 py-1.5 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs flex items-center gap-1.5 transition-all"
                          >
                            <Plus size={14} />
                            {t("training.programs.create.form.addExercise")}
                          </button>
                        )}
                      </div>

                      <div className="p-3 space-y-2">
                        {isEditMode
                          ? day.exercises.map((ex: any, exIdx) => (
                              <div
                                key={exIdx}
                                className="flex gap-2 items-start bg-background p-3 rounded-lg"
                              >
                                <div className="flex-1 grid grid-cols-3 gap-2">
                                  <InputField
                                    placeholder={t(
                                      "training.programs.create.form.exerciseName"
                                    )}
                                    value={ex.name}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
                                        exIdx,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <InputField
                                    type="number"
                                    placeholder={t(
                                      "training.programs.create.form.sets"
                                    )}
                                    value={ex.recommendedSets}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
                                        exIdx,
                                        "recommendedSets",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    min="0"
                                  />
                                  <InputField
                                    type="number"
                                    placeholder={t(
                                      "training.programs.create.form.reps"
                                    )}
                                    value={ex.recommendedReps}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
                                        exIdx,
                                        "recommendedReps",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    min="0"
                                  />
                                </div>
                                <button
                                  onClick={() => removeExercise(index, exIdx)}
                                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            ))
                          : day.exercises.map((ex: any, exIdx) => (
                              <button
                                key={exIdx}
                                onClick={() => setSelectedExercise(ex)}
                                className="w-full text-left flex items-center justify-between p-3 hover:bg-background rounded-lg group transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-text-secondary font-mono text-sm w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    {exIdx + 1}
                                  </span>
                                  <div>
                                    <span className="font-medium text-text-primary group-hover:text-primary transition-colors block">
                                      {ex.name}
                                    </span>
                                    {(ex.recommendedSets ||
                                      ex.recommendedReps) && (
                                      <span className="text-xs text-text-secondary">
                                        {ex.recommendedSets} sets ×{" "}
                                        {ex.recommendedReps} reps
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {ex.videoUrl ? (
                                  <PlayCircle
                                    size={18}
                                    className="text-text-secondary group-hover:text-primary"
                                  />
                                ) : (
                                  <ChevronRight
                                    size={18}
                                    className="text-text-secondary group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                  />
                                )}
                              </button>
                            ))}
                        {day.exercises.length === 0 && (
                          <p className="text-sm text-text-secondary text-center py-4">
                            {t("training.programs.create.form.noExercises")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-surface-secondary border-t-2 border-border flex-shrink-0">
            <div className="flex gap-3">
              {isEditMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updateProgram.isPending}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all disabled:opacity-50"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={updateProgram.isPending}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {updateProgram.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("common.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {t("common.save")}
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all"
                  >
                    {t("common.close")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUse(program._id!);
                      onClose();
                    }}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Dumbbell className="w-5 h-5" />
                    {t("training.programs.details.start")}
                  </button>
                </>
              )}
            </div>
          </div>
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

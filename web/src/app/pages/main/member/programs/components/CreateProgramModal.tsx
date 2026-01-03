import {
  type CreateExerciseDto,
  type CreateProgramDto,
  type DaysPerWeek,
  EXPERIENCE_LEVELS,
  type ExperienceLevel,
  PROGRAM_PURPOSES,
  type ProgramPurpose,
} from "@ahmedrioueche/gympro-client";
import { Dumbbell, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../components/ui/InputField";
import { useCreateProgram } from "../../../../../../hooks/queries/useTraining";

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProgramModal = ({
  isOpen,
  onClose,
}: CreateProgramModalProps) => {
  const createProgram = useCreateProgram();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<CreateProgramDto>({
    name: "",
    description: "",
    experience: "beginner",
    purpose: "general_fitness",
    daysPerWeek: 3,
    days: [],
    isPublic: false,
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name) {
        toast.error(t("training.programs.create.validation.nameRequired"));
        return;
      }
      // Initialize days if empty
      if (formData.days.length === 0) {
        const initialDays = Array.from({ length: formData.daysPerWeek }).map(
          (_, i) => ({
            name: `${t("training.programs.create.form.day")} ${i + 1}`,
            exercises: [],
          })
        );
        setFormData({ ...formData, days: initialDays });
      } else if (formData.days.length !== formData.daysPerWeek) {
        // Adjust days if daysPerWeek changed
        const currentDays = [...formData.days];
        if (currentDays.length < formData.daysPerWeek) {
          const needed = formData.daysPerWeek - currentDays.length;
          for (let i = 0; i < needed; i++) {
            currentDays.push({
              name: `${t("training.programs.create.form.day")} ${
                currentDays.length + 1
              }`,
              exercises: [],
            });
          }
        } else {
          currentDays.splice(formData.daysPerWeek);
        }
        setFormData({ ...formData, days: currentDays });
      }
      setStep(2);
    } else {
      // Validate and clean up days before submission
      const cleanedDays = formData.days.map((day, index) => ({
        ...day,
        name:
          day.name.trim() ||
          `${t("training.programs.create.form.day")} ${index + 1}`,
      }));

      // Save
      createProgram.mutate(
        { ...formData, days: cleanedDays },
        {
          onSuccess: () => {
            onClose();
            setStep(1);
            setFormData({
              name: "",
              description: "",
              experience: "beginner",
              purpose: "general_fitness",
              daysPerWeek: 3,
              days: [],
              isPublic: false,
            });
          },
        }
      );
    }
  };

  const updateDayName = (index: number, name: string) => {
    const newDays = [...formData.days];
    newDays[index].name = name;
    setFormData({ ...formData, days: newDays });
  };

  const addExercise = (dayIndex: number) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises.push({
      name: "",
      recommendedSets: 3,
      recommendedReps: 10,
      targetMuscles: [],
      equipment: [],
    } as CreateExerciseDto);
    setFormData({ ...formData, days: newDays });
  };

  const updateExercise = (
    dayIndex: number,
    exIndex: number,
    field: keyof CreateExerciseDto,
    value: any
  ) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises[exIndex] = {
      ...newDays[dayIndex].exercises[exIndex],
      [field]: value,
    };
    setFormData({ ...formData, days: newDays });
  };

  const removeExercise = (dayIndex: number, exIndex: number) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises.splice(exIndex, 1);
    setFormData({ ...formData, days: newDays });
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

  const daysOptions = [1, 2, 3, 4, 5, 6, 7].map((num) => ({
    value: num.toString(),
    label: `${num} ${t("training.programs.create.form.daysPerWeek")}`,
  }));

  if (!isOpen) return null;

  return (
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
                <h2 className="text-2xl font-bold text-white mb-1">
                  {step === 1
                    ? t("training.programs.create.title")
                    : t("training.programs.create.schedule")}
                </h2>
                <p className="text-white/90 text-sm">
                  {step === 1
                    ? t("training.programs.create.subtitle")
                    : t("training.programs.create.scheduleSubtitle")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="p-6 space-y-6">
            {step === 1 ? (
              <>
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-primary" />
                    {t("training.programs.create.basicInfo")}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label={t("training.programs.create.form.name")}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t(
                        "training.programs.create.form.namePlaceholder"
                      )}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">
                        {t("training.programs.create.form.description")}
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder={t(
                          "training.programs.create.form.descriptionPlaceholder"
                        )}
                        rows={3}
                        className="w-full p-3 bg-background-secondary rounded-xl border border-border text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Program Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {t("training.programs.create.programDetails")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CustomSelect
                      title={t("training.programs.create.form.experience")}
                      options={experienceOptions}
                      selectedOption={formData.experience}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          experience: value as ExperienceLevel,
                        })
                      }
                    />

                    <CustomSelect
                      title={t("training.programs.create.form.purpose")}
                      options={purposeOptions}
                      selectedOption={formData.purpose}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          purpose: value as ProgramPurpose,
                        })
                      }
                    />

                    <CustomSelect
                      title={t(
                        "training.programs.create.form.daysPerWeekLabel"
                      )}
                      options={daysOptions}
                      selectedOption={formData.daysPerWeek.toString()}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          daysPerWeek: parseInt(value) as DaysPerWeek,
                        })
                      }
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Schedule Configuration */}
                <div className="space-y-4">
                  {formData.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="bg-background-secondary border border-border rounded-xl p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <InputField
                          value={day.name}
                          onChange={(e) =>
                            updateDayName(dayIndex, e.target.value)
                          }
                          placeholder={`${t(
                            "training.programs.create.form.day"
                          )} ${dayIndex + 1}`}
                        />
                        <button
                          onClick={() => addExercise(dayIndex)}
                          className="ml-3 px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Plus size={16} />
                          {t("training.programs.create.form.addExercise")}
                        </button>
                      </div>

                      {day.exercises.length === 0 ? (
                        <p className="text-sm text-text-secondary text-center py-4">
                          {t("training.programs.create.form.noExercises")}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {day.exercises.map((ex, exIndex) => (
                            <div
                              key={exIndex}
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
                                      dayIndex,
                                      exIndex,
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
                                      dayIndex,
                                      exIndex,
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
                                      dayIndex,
                                      exIndex,
                                      "recommendedReps",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  min="0"
                                />
                              </div>
                              <button
                                onClick={() =>
                                  removeExercise(dayIndex, exIndex)
                                }
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-secondary border-t-2 border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => (step === 1 ? onClose() : setStep(1))}
              disabled={createProgram.isPending}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-text-secondary bg-surface hover:bg-surface-secondary border-2 border-border hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 1
                ? t("common.cancel", "Cancel")
                : t("common.back", "Back")}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={createProgram.isPending}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {createProgram.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("common.creating", "Creating...")}
                </>
              ) : step === 1 ? (
                <>
                  {t("common.next", "Next")}
                  <Plus className="w-5 h-5" />
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {t("training.programs.create.createButton")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

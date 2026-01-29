import {
  type CreateExerciseDto,
  MUSCLE_GROUPS,
  type MuscleGroup,
} from "@ahmedrioueche/gympro-client";
import {
  ChevronDown,
  GripVertical,
  Layers,
  Plus,
  Search,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../components/ui/CustomSelect";
import InputField from "../../../components/ui/InputField";
import { useUserStore } from "../../../store/user";
import { useExerciseForm } from "../../hooks/useExerciseForm";

interface ExerciseFormProps {
  exercise: CreateExerciseDto;
  exerciseIndex: number;
  isDragging?: boolean;
  isCollapsed?: boolean;
  isLibraryOpen?: boolean;
  isSelectionMode?: boolean; // New prop
  isSelected?: boolean; // New prop
  onUpdate: (field: keyof CreateExerciseDto, value: any) => void;
  onRemove: () => void;
  onAddNext?: () => void;
  onToggleLibrary?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: (targetIndex: number) => void;
  onToggleCollapse?: () => void;
  onSelect?: () => void; // New prop
}

export const ExerciseForm = ({
  exercise,
  exerciseIndex,
  isDragging = false,
  isCollapsed = false,
  isLibraryOpen = false,
  isSelectionMode = false,
  isSelected = false,
  onUpdate,
  onRemove,
  onAddNext,
  onToggleLibrary,
  onDragStart,
  onDragEnd,
  onDragOver,
  onToggleCollapse,
  onSelect,
}: ExerciseFormProps) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const defaultRestTime = user?.appSettings?.timer?.defaultRestTime ?? 90;

  const {
    selectedMuscle,
    handleMuscleChange,
    applySuggestion,
    clearSuggestions,
    suggestions,
    muscleOptions,
  } = useExerciseForm({ exercise, onUpdate });

  return (
    <div
      draggable={!!onDragStart && !isSelectionMode} // Disable drag in selection mode
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onDragOver?.(exerciseIndex);
      }}
      onClick={(e) => {
        // If in selection mode, handle click to select
        if (isSelectionMode && onSelect) {
          e.stopPropagation(); // Prevent bubbling if parent has handler, though we want to handle it here
          onSelect();
        }
      }}
      className={`flex flex-col gap-3 p-4 bg-background-secondary/30 rounded-xl border border-border/50 transition-all ${
        isDragging ? "opacity-50 scale-95" : ""
      } ${onDragStart && !isSelectionMode ? "cursor-move" : ""} ${
        isSelectionMode
          ? "hover:border-primary/50 cursor-pointer"
          : "hover:border-primary/30"
      }`}
    >
      {/* Collapsed View - Just Exercise Name */}
      {isCollapsed ? (
        <div className="flex items-center gap-2">
          {onDragStart && !isSelectionMode && (
            <div className="text-text-secondary/50 hover:text-text-secondary transition-colors cursor-grab active:cursor-grabbing flex-shrink-0">
              <GripVertical size={16} />
            </div>
          )}
          <span className="font-medium text-text-primary truncate flex-1">
            {exercise.name || t("training.programs.create.form.exerciseName")}
          </span>

          {isSelectionMode ? (
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${isSelected ? "bg-primary border-primary" : "bg-surface border-border hover:border-primary"}`}
            >
              {isSelected && <Layers size={12} className="text-white" />}
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse?.();
              }}
              className="p-1.5 hover:bg-background-secondary rounded-lg transition-colors flex-shrink-0"
            >
              <ChevronDown size={16} className="text-text-secondary" />
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Expanded View - Full Form */}
          <div className="flex items-center gap-2 mb-3">
            {onDragStart && !isSelectionMode && (
              <div className="text-text-secondary/50 hover:text-text-secondary transition-colors cursor-grab active:cursor-grabbing flex-shrink-0">
                <GripVertical size={16} />
              </div>
            )}
            <span className="text-sm font-medium text-text-secondary flex-1">
              {t("training.programs.create.form.exercise")} #{exerciseIndex + 1}
            </span>

            {isSelectionMode ? (
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${isSelected ? "bg-primary border-primary" : "bg-surface border-border hover:border-primary"}`}
              >
                {isSelected && <Layers size={12} className="text-white" />}
              </div>
            ) : (
              onToggleCollapse && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCollapse();
                  }}
                  className="p-1 hover:bg-background-secondary rounded-lg transition-colors flex-shrink-0"
                >
                  <ChevronDown
                    size={18}
                    className="text-text-secondary transform rotate-180"
                  />
                </button>
              )
            )}
          </div>
          {/* Row 1: Name and Muscle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              {" "}
              {/* Added flex-1 flex gap-2 */}
              <div className="flex-1">
                {" "}
                {/* Wrapped InputField in flex-1 div */}
                <InputField
                  placeholder={t("training.programs.create.form.exerciseName")}
                  value={exercise.name}
                  onChange={(e) => onUpdate("name", e.target.value)}
                  className="w-full"
                  label={t("training.programs.create.form.exerciseName")}
                />
              </div>
              {onToggleLibrary && (
                <button
                  type="button"
                  onClick={onToggleLibrary}
                  className={`h-[50px] w-[50px] mt-auto flex items-center justify-center rounded-xl transition-all flex-shrink-0 border ${
                    isLibraryOpen
                      ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                      : "bg-surface-secondary text-text-secondary border-border hover:border-primary/50 hover:text-primary"
                  }`}
                  title={t("training.programs.create.form.addFromLibrary")}
                >
                  <Search size={20} />
                </button>
              )}
            </div>
            <div className="w-full sm:w-[200px]">
              <CustomSelect
                title={t("training.programs.create.form.targetMuscles")}
                options={muscleOptions(MUSCLE_GROUPS)}
                selectedOption={selectedMuscle as MuscleGroup}
                onChange={(val) => handleMuscleChange(val as MuscleGroup)}
                marginTop="mt-1"
                placeholder={t(
                  "training.programs.create.form.selectMuscle",
                  "Select Muscle",
                )}
              />
            </div>
          </div>

          {/* Row 2: Details & Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:w-24">
                <InputField
                  type="number"
                  placeholder="0"
                  value={exercise.recommendedSets}
                  onChange={(e) =>
                    onUpdate("recommendedSets", parseInt(e.target.value) || 0)
                  }
                  min="0"
                  label={t("training.programs.create.form.sets")}
                />
              </div>
              <div className="flex-1 sm:w-24">
                <InputField
                  type="number"
                  placeholder="0"
                  value={exercise.recommendedReps}
                  onChange={(e) =>
                    onUpdate("recommendedReps", parseInt(e.target.value) || 0)
                  }
                  min="0"
                  label={t("training.programs.create.form.reps")}
                />
              </div>
              <div className="flex-1 sm:w-24">
                <InputField
                  type="number"
                  placeholder={defaultRestTime.toString()}
                  value={exercise.restTime}
                  onChange={(e) =>
                    onUpdate("restTime", parseInt(e.target.value) || 0)
                  }
                  min="0"
                  label={t(
                    "training.programs.create.form.restTime",
                    "Rest (s)",
                  )}
                />
              </div>
            </div>

            <div className="flex-1 w-full relative">
              {typeof exercise.videoUrl !== "string" ? (
                <button
                  type="button"
                  onClick={() => onUpdate("videoUrl", "")}
                  className="h-[50px] px-3 mt-auto w-full sm:w-auto text-sm text-text-secondary hover:text-primary border border-dashed border-border hover:border-primary/50 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Video size={16} />
                  {t("training.programs.create.form.addVideo")}
                </button>
              ) : (
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <InputField
                      placeholder="https://youtube.com/..."
                      value={exercise.videoUrl}
                      onChange={(e) =>
                        onUpdate("videoUrl", e.target.value || undefined)
                      }
                      label={t("training.programs.create.form.videoUrl")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdate("videoUrl", undefined)}
                    className="h-[38px] w-[38px] flex items-center justify-center text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 w-full sm:w-auto pt-2 sm:pt-0">
              {exercise.name && onAddNext && (
                <button
                  type="button"
                  onClick={onAddNext}
                  className="px-3 py-1.5 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs flex items-center gap-1.5 transition-all"
                  title={t(
                    "training.programs.create.form.addNextExercise",
                    "Add Next Exercise",
                  )}
                >
                  <Plus size={16} />
                  <span className="sm:hidden lg:inline">
                    {t("training.programs.create.form.addNext", "Add Next")}
                  </span>
                </button>
              )}

              {/* Removed the AI suggestion button */}

              <button
                onClick={onRemove}
                className="h-[42px] w-[42px] flex items-center justify-center text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 ml-auto sm:ml-0"
                title={t("common.delete")}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* AI Suggestions Panel (Full Width) */}
          {suggestions.length > 0 && (
            <div className="w-full mt-2 p-3 bg-surface rounded-xl border border-border/50 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-text-secondary">
                  {t("training.programs.create.form.aiSuggestions")}
                </span>
                <button
                  onClick={clearSuggestions}
                  className="text-xs text-text-secondary hover:text-primary transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applySuggestion(s)}
                    className="text-xs px-3 py-1.5 bg-background-secondary hover:bg-primary hover:text-white text-text-primary rounded-lg border border-border transition-all text-left"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

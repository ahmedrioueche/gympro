import {
  type CreateExerciseDto,
  type CreateProgramDayDto,
} from "@ahmedrioueche/gympro-client";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";
import { ExerciseSelector } from "../../../../../components/gym/ExerciseSelector";
import { ExerciseForm } from "./ExerciseForm";
import { ExerciseItem } from "./program-details-modal/ExerciseItem";

interface DayCardProps {
  day: CreateProgramDayDto;
  dayIndex: number;
  isEditMode: boolean;
  onDayNameChange: (name: string) => void;
  onAddExercise: (data?: any) => void;
  onExerciseUpdate: (
    exIndex: number,
    field: keyof CreateExerciseDto,
    value: any
  ) => void;
  onExerciseRemove: (exIndex: number) => void;
  onExerciseReorder: (fromIndex: number, toIndex: number) => void;
  onExerciseClick: (exercise: any) => void;
}

export const DayCard = ({
  day,
  dayIndex,
  isEditMode,
  onDayNameChange,
  onAddExercise,
  onExerciseUpdate,
  onExerciseRemove,
  onExerciseReorder,
  onExerciseClick,
}: DayCardProps) => {
  const { t } = useTranslation();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [collapsedExercises, setCollapsedExercises] = useState<Set<number>>(
    new Set()
  );

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    // Auto-collapse all exercises when drag starts
    const allIndices = new Set(day.exercises.map((_, idx) => idx));
    setCollapsedExercises(allIndices);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    // Keep exercises collapsed after drag ends for cleaner view
  };

  const toggleCollapse = (index: number) => {
    setCollapsedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(
    null
  );

  return (
    <div className="bg-background-secondary border border-border rounded-xl">
      <div className="bg-background-tertiary p-3 border-b border-border flex items-center justify-between rounded-t-xl">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          {isEditMode ? (
            <InputField
              value={day.name}
              onChange={(e) => onDayNameChange(e.target.value)}
              placeholder={`${t("training.programs.create.form.day")} ${
                dayIndex + 1
              }`}
            />
          ) : (
            <span className="font-medium text-text-primary">
              {t("training.programs.create.form.dayName")} {dayIndex + 1}:{" "}
              {day.name}
            </span>
          )}
        </div>
        {isEditMode && (
          <button
            onClick={() => onAddExercise({})}
            className="p-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs flex items-center gap-1.5 transition-all"
          >
            <Plus size={14} />
            {t("training.programs.create.form.addExercise")}
          </button>
        )}
      </div>

      <div className="p-3 space-y-2">
        {isEditMode ? (
          <>
            {day.exercises.map((ex: any, exIdx) => (
              <div key={exIdx}>
                {showExerciseSelector && activeExerciseIndex === exIdx ? (
                  <div className="animate-in fade-in zoom-in duration-300">
                    <ExerciseSelector
                      onSelect={(exercise) => {
                        const exerciseData = {
                          name: exercise.name,
                          description: exercise.description,
                          instructions: exercise.instructions,
                          recommendedSets: exercise.recommendedSets || 3,
                          recommendedReps: exercise.recommendedReps || 10,
                          targetMuscles: exercise.targetMuscles,
                          equipment: exercise.equipment,
                          videoUrl: exercise.videoUrl,
                          imageUrl: exercise.imageUrl,
                          difficulty: exercise.difficulty,
                          type: exercise.type,
                        };

                        Object.entries(exerciseData).forEach(([key, value]) => {
                          onExerciseUpdate(
                            exIdx,
                            key as keyof CreateExerciseDto,
                            value
                          );
                        });
                        setShowExerciseSelector(false);
                        setActiveExerciseIndex(null);
                      }}
                      onCancel={() => {
                        setShowExerciseSelector(false);
                        setActiveExerciseIndex(null);
                      }}
                    />
                  </div>
                ) : (
                  <ExerciseForm
                    exercise={ex}
                    exerciseIndex={exIdx}
                    isDragging={draggedIndex === exIdx}
                    isCollapsed={collapsedExercises.has(exIdx)}
                    isLibraryOpen={
                      showExerciseSelector && activeExerciseIndex === exIdx
                    }
                    onUpdate={(field, value) =>
                      onExerciseUpdate(exIdx, field, value)
                    }
                    onRemove={() => onExerciseRemove(exIdx)}
                    onAddNext={
                      exIdx === day.exercises.length - 1
                        ? () => onAddExercise({})
                        : undefined
                    }
                    onToggleLibrary={() => {
                      // Toggle logic: since we swap, clicking it (from form) always opens it.
                      // If it was already open, we'd be in the other branch (Selector),
                      // so we just need to set active index here.
                      setActiveExerciseIndex(exIdx);
                      setShowExerciseSelector(true);
                    }}
                    onDragStart={() => handleDragStart(exIdx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(targetIndex) => {
                      if (
                        draggedIndex !== null &&
                        draggedIndex !== targetIndex
                      ) {
                        onExerciseReorder(draggedIndex, targetIndex);
                        setDraggedIndex(targetIndex);
                      }
                    }}
                    onToggleCollapse={() => toggleCollapse(exIdx)}
                  />
                )}
              </div>
            ))}
          </>
        ) : (
          day.exercises.map((ex: any, exIdx) => (
            <ExerciseItem
              key={exIdx}
              exercise={ex}
              index={exIdx}
              onClick={() => onExerciseClick(ex)}
            />
          ))
        )}
        {day.exercises.length === 0 && !showExerciseSelector && (
          <p className="text-sm text-text-secondary text-center py-4">
            {t("training.programs.create.form.noExercises")}
          </p>
        )}
      </div>
    </div>
  );
};

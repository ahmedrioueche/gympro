import {
  type CreateExerciseDto,
  type CreateProgramDayDto,
} from "@ahmedrioueche/gympro-client";
import { Calendar, Layers, Link as LinkIcon, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../../components/ui/InputField";
import { ExerciseItem } from "../modals/program-details-modal/ExerciseItem";
import { ExerciseForm } from "./ExerciseForm";
import { ExerciseSelector } from "./ExerciseSelector";

interface DayCardProps {
  day: CreateProgramDayDto;
  dayIndex: number;
  isEditMode: boolean;
  onDayNameChange: (name: string) => void;
  onAddExercise: (data?: any) => void;
  onExerciseUpdate: (
    blockIndex: number,
    exIndex: number,
    field: keyof CreateExerciseDto,
    value: any,
  ) => void;
  onExerciseRemove: (blockIndex: number, exIndex: number) => void;
  onBlockReorder: (fromIndex: number, toIndex: number) => void;
  onGroupBlocks?: (blockIndices: number[]) => void;
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
  onBlockReorder,
  onGroupBlocks,
  onExerciseClick,
}: DayCardProps) => {
  const { t } = useTranslation();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<number>>(
    new Set(),
  );
  const [selectedBlocks, setSelectedBlocks] = useState<Set<number>>(new Set());

  // Track previous block count to detect additions
  const prevBlockCountRef = useRef(day.blocks.length);

  useEffect(() => {
    // If a block was added (count increased)
    if (day.blocks.length > prevBlockCountRef.current) {
      const lastIndex = day.blocks.length - 1;
      const lastBlock = day.blocks[lastIndex];

      // If it's a single block with one empty exercise (freshly added)
      if (
        lastBlock.type === "single" &&
        lastBlock.exercises.length === 1 &&
        !lastBlock.exercises[0].name
      ) {
        setActiveBlockIndex(lastIndex);
        setShowExerciseSelector(true);
      }
    }
    prevBlockCountRef.current = day.blocks.length;
  }, [day.blocks]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    // Auto-collapse all blocks when drag starts
    const allIndices = new Set(day.blocks.map((_, idx) => idx));
    setCollapsedBlocks(allIndices);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleCollapse = (index: number) => {
    setCollapsedBlocks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleSelection = (index: number) => {
    setSelectedBlocks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleGroup = () => {
    if (onGroupBlocks && selectedBlocks.size >= 2) {
      onGroupBlocks(Array.from(selectedBlocks));
      setSelectedBlocks(new Set());
      setIsSelectionMode(false);
    }
  };

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setIsSelectionMode(false);
      setSelectedBlocks(new Set());
    } else {
      setIsSelectionMode(true);
    }
  };

  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);

  // Flatten exercises for view-only mode if needed, or iterate blocks
  // For view mode we just show exercises in order
  const viewExercises = day.blocks.flatMap((b) => b.exercises);

  return (
    <div className="bg-background-secondary border border-border rounded-xl overflow-hidden">
      <div className="bg-surface p-3 border-b border-border flex items-center justify-between sticky top-0 z-0 shadow-sm">
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
          <div className="flex items-center gap-2">
            {isSelectionMode ? (
              <>
                <button
                  onClick={toggleSelectionMode}
                  className="px-3 py-1.5 rounded-lg text-text-secondary hover:bg-surface-secondary text-xs font-medium transition-all"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleGroup}
                  disabled={selectedBlocks.size < 2}
                  title={t(
                    "training.programs.create.form.groupHint",
                    "Select exercises to create a Superset",
                  )}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <LinkIcon size={14} />
                  {t(
                    "training.programs.create.form.createSuperset",
                    "Create Superset",
                  )}{" "}
                  ({selectedBlocks.size})
                </button>
              </>
            ) : (
              <>
                {day.blocks.length > 1 && (
                  <button
                    onClick={toggleSelectionMode}
                    className="px-3 py-1.5 rounded-lg text-primary hover:bg-primary/10 text-xs font-medium transition-all"
                  >
                    {t("training.programs.create.form.createSuperset")}
                  </button>
                )}
                <button
                  onClick={() => onAddExercise({})}
                  className="p-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus size={14} />
                  {t("training.programs.create.form.addExercise")}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="p-3 space-y-3">
        {isEditMode ? (
          <>
            {day.blocks.map((block, blockIndex) => {
              const isSelected = selectedBlocks.has(blockIndex);
              const isSuperset =
                block.type === "superset" || block.type === "circuit";

              return (
                <div
                  key={blockIndex}
                  onClick={
                    isSelectionMode
                      ? () => toggleSelection(blockIndex)
                      : undefined
                  }
                  className={`relative transition-all rounded-xl ${
                    isSuperset
                      ? "border-2 border-primary/30 bg-primary/5 p-3"
                      : ""
                  } ${
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-surface cursor-pointer select-none"
                      : isSelectionMode
                        ? "hover:bg-background-secondary/80 cursor-pointer ring-1 ring-border hover:ring-primary/50"
                        : ""
                  }`}
                >
                  {/* Superset Header */}
                  {isSuperset && (
                    <div className="flex items-center gap-2 mb-3 text-primary font-semibold text-sm">
                      <Layers size={14} />
                      <span>
                        {block.type === "superset" ? "Superset" : "Circuit"}
                      </span>
                      <div className="flex-1" />
                    </div>
                  )}

                  {/* NOTE: We allow clicking the block logic, but main visual feedback is via ExerciseForm check */}

                  <div className={`space-y-2`}>
                    {/* Disable internal interactions when in selection mode */}
                    {block.exercises.map((ex, exIndex) => (
                      <div key={exIndex}>
                        {showExerciseSelector &&
                        activeBlockIndex === blockIndex &&
                        !ex.name ? (
                          <div className="animate-in fade-in zoom-in duration-300">
                            <ExerciseSelector
                              onSelect={(exercise) => {
                                const exerciseData = {
                                  name: exercise.name,
                                  description: exercise.description,
                                  instructions: exercise.instructions,
                                  recommendedSets:
                                    exercise.recommendedSets || 3,
                                  recommendedReps:
                                    exercise.recommendedReps || 10,
                                  targetMuscles: exercise.targetMuscles,
                                  equipment: exercise.equipment,
                                  videoUrl: exercise.videoUrl,
                                  imageUrl: exercise.imageUrl,
                                  difficulty: exercise.difficulty,
                                  type: exercise.type,
                                };

                                Object.entries(exerciseData).forEach(
                                  ([key, value]) => {
                                    onExerciseUpdate(
                                      blockIndex,
                                      exIndex,
                                      key as keyof CreateExerciseDto,
                                      value,
                                    );
                                  },
                                );
                                setShowExerciseSelector(false);
                                setActiveBlockIndex(null);
                              }}
                              onCancel={() => {
                                setShowExerciseSelector(false);
                                setActiveBlockIndex(null);
                              }}
                            />
                          </div>
                        ) : (
                          <ExerciseForm
                            exercise={ex}
                            exerciseIndex={exIndex}
                            isDragging={draggedIndex === blockIndex}
                            isCollapsed={
                              collapsedBlocks.has(blockIndex) || isSelectionMode
                            } // Auto-collapse in selection mode for cleaner view
                            isSelectionMode={isSelectionMode}
                            isSelected={isSelected}
                            onSelect={() => toggleSelection(blockIndex)}
                            isLibraryOpen={
                              showExerciseSelector &&
                              activeBlockIndex === blockIndex
                            }
                            onUpdate={(field, value) =>
                              !isSelectionMode &&
                              onExerciseUpdate(
                                // Prevent updates in selection mode
                                blockIndex,
                                exIndex,
                                field,
                                value,
                              )
                            }
                            onRemove={() =>
                              onExerciseRemove(blockIndex, exIndex)
                            }
                            onAddNext={
                              blockIndex === day.blocks.length - 1 &&
                              exIndex === block.exercises.length - 1
                                ? () => onAddExercise({})
                                : undefined
                            }
                            onToggleLibrary={() => {
                              setActiveBlockIndex(blockIndex);
                              setShowExerciseSelector(true);
                            }}
                            onDragStart={() => handleDragStart(blockIndex)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(targetIndex) => {
                              if (
                                draggedIndex !== null &&
                                draggedIndex !== targetIndex
                              ) {
                                onBlockReorder(draggedIndex, targetIndex);
                                setDraggedIndex(targetIndex);
                              }
                            }}
                            onToggleCollapse={() => toggleCollapse(blockIndex)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          viewExercises.map((ex: any, exIdx) => (
            <ExerciseItem
              key={exIdx}
              exercise={ex}
              index={exIdx}
              onClick={() => onExerciseClick(ex)}
            />
          ))
        )}
        {day.blocks.length === 0 && !showExerciseSelector && (
          <p className="text-sm text-text-secondary text-center py-4">
            {t("training.programs.create.form.noExercises")}
          </p>
        )}
      </div>
    </div>
  );
};

import { MUSCLE_GROUPS, MUSCLE_SUBGROUPS } from "@ahmedrioueche/gympro-client";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface MuscleSelectorProps {
  selectedMuscles: string[];
  onChange: (muscles: string[]) => void;
}

export const MuscleSelector = ({
  selectedMuscles,
  onChange,
}: MuscleSelectorProps) => {
  const { t } = useTranslation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (group: string) => {
    if (expandedGroups.includes(group)) {
      setExpandedGroups(expandedGroups.filter((g) => g !== group));
    } else {
      setExpandedGroups([...expandedGroups, group]);
    }
  };

  const isSelected = (muscle: string) => selectedMuscles.includes(muscle);

  const handleToggleMuscle = (muscle: string) => {
    if (isSelected(muscle)) {
      onChange(selectedMuscles.filter((m) => m !== muscle));
    } else {
      onChange([...selectedMuscles, muscle]);
    }
  };

  // Group handling:
  // We use MUSCLE_GROUPS as the main categories.
  // We check if there are subgroups in MUSCLE_SUBGROUPS for that key.

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-text-secondary">
        {t("training.exercises.form.targetMuscles")}
      </label>
      <div className="space-y-2 border border-border rounded-xl p-2 bg-surface-secondary/20 max-h-[400px] overflow-y-auto custom-scrollbar">
        {MUSCLE_GROUPS.map((group) => {
          // Type assertion needed because MUSCLE_SUBGROUPS keys might not perfectly match MUSCLE_GROUPS values 1:1 in a type-safe way automatically without stricter types,
          // but we know they overlap.
          // Actually, MUSCLE_SUBGROUPS has 'arms' but MUSCLE_GROUPS has 'biceps', 'triceps'.
          // Let's check how we want to group this.
          // The user defined MUSCLE_SUBGROUPS with keys: chest, back, shoulders, arms, legs, glutes, calves, core.
          // MUSCLE_GROUPS (original) had: chest, back, biceps, triceps, shoulders, legs, glutes, calves, core.

          // If we use MUSCLE_GROUPS as the iterator, 'biceps' and 'triceps' are there.
          // But in MUSCLE_SUBGROUPS they are under 'arms'.

          // Strategy: Iterate over keys of MUSCLE_SUBGROUPS instead?
          // Or iterate over a combined list.
          // Let's use the keys from MUSCLE_SUBGROUPS as the "Main Groups" for the accordion,
          // plus any from MUSCLE_GROUPS that are not in MUSCLE_SUBGROUPS (if any).

          // Actually, let's just stick to the keys of MUSCLE_SUBGROUPS for the categorized view,
          // as that seems to be the intended hierarchy.
          // wait, 'biceps' and 'triceps' were top level before. Now they are in 'arms'.
          // So we should probably render the groups based on MUSCLE_SUBGROUPS keys.

          return null;
        })}
        {Object.entries(MUSCLE_SUBGROUPS).map(([groupKey, subgroups]) => {
          const isExpanded = expandedGroups.includes(groupKey);
          const groupSelected = isSelected(groupKey);

          // Check if all/some subgroups are selected?
          // Simplest: Just check if the groupKey itself is in selectedMuscles.

          return (
            <div
              key={groupKey}
              className="bg-surface rounded-lg border border-border overflow-hidden"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-3 hover:bg-surface-secondary transition-colors cursor-pointer"
                onClick={() => toggleGroup(groupKey)}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMuscle(groupKey);
                    }}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      groupSelected
                        ? "bg-primary border-primary text-white"
                        : "border-text-tertiary hover:border-primary"
                    }`}
                  >
                    {groupSelected && <Check size={12} />}
                  </button>
                  <span className="font-medium text-text-primary capitalize">
                    {t(`training.muscles.${groupKey}`)}
                  </span>
                </div>
                <button type="button" className="text-text-tertiary">
                  {isExpanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              </div>

              {/* Subgroups */}
              {isExpanded && (
                <div className="p-3 pt-0 border-t border-border bg-surface-secondary/10">
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {subgroups.map((subgroup) => (
                      <button
                        key={subgroup}
                        type="button"
                        onClick={() => handleToggleMuscle(subgroup)}
                        className={`px-3 py-1.5 rounded-lg text-xs border text-left transition-colors truncate ${
                          isSelected(subgroup)
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-surface text-text-secondary border-border hover:border-text-secondary"
                        }`}
                      >
                        {t(`training.muscles.${subgroup}`)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

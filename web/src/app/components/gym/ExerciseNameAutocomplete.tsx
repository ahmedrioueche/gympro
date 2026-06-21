import { type Exercise } from "@ahmedrioueche/gympro-client";
import { Dumbbell, Info, Video } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import InputField from "../../../components/ui/InputField";
import { useExercises } from "../../../hooks/queries/useExercises";
import { useModalStore } from "../../../store/modal";

interface ExerciseNameAutocompleteProps {
  value: string;
  onChange: (name: string) => void;
  onSelect: (exercise: Exercise) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

const getYouTubeId = (url?: string) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getThumbnail = (exercise: Exercise) => {
  const youtubeId = getYouTubeId(exercise.videoUrl);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  }
  return exercise.imageUrl;
};

export const ExerciseNameAutocomplete = ({
  value,
  onChange,
  onSelect,
  label,
  placeholder,
  className = "",
  autoFocus = false,
}: ExerciseNameAutocompleteProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(value);
  const [dropdownStyle, setDropdownStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const trimmedSearch = debouncedSearch.trim();
  const { data: exercisesResponse, isLoading } = useExercises(
    trimmedSearch ? { search: trimmedSearch } : undefined,
    { enabled: isFocused && trimmedSearch.length >= 1 },
  );
  const exercises = exercisesResponse?.data || [];

  const showDropdown = isFocused && trimmedSearch.length >= 1;

  const updateDropdownPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownStyle({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!showDropdown) {
      setDropdownStyle(null);
      return;
    }

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [showDropdown, updateDropdownPosition, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setIsFocused(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    setIsFocused(false);
  };

  const renderDropdown = () => {
    if (!showDropdown || !dropdownStyle) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        className="fixed z-[9999] rounded-xl border border-border shadow-2xl overflow-hidden bg-background"
        style={{
          top: `${dropdownStyle.top}px`,
          left: `${dropdownStyle.left}px`,
          width: `${dropdownStyle.width}px`,
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="max-h-56 overflow-y-auto custom-scrollbar bg-background">
          {isLoading ? (
            <div className="flex justify-center py-6 bg-background">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
            </div>
          ) : exercises.length === 0 ? (
            <div className="px-3 py-3 text-sm text-text-secondary bg-background">
              {t("training.exercises.selector.noMatchesUseCustom", {
                name: trimmedSearch,
              })}
            </div>
          ) : (
            exercises.map((exercise) => {
              const thumbnail = getThumbnail(exercise);

              return (
                <div
                  key={exercise._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelect(exercise)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(exercise);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 bg-background hover:bg-surface-secondary transition-colors text-left border-b border-border/50 last:border-b-0 cursor-pointer"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface flex-shrink-0 border border-border/50">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-secondary">
                        <Dumbbell size={16} />
                      </div>
                    )}
                    {exercise.videoUrl && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Video size={12} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {exercise.name}
                    </p>
                    {exercise.targetMuscles?.length ? (
                      <p className="text-xs text-text-secondary truncate capitalize">
                        {exercise.targetMuscles
                          .slice(0, 2)
                          .map((muscle) => t(`training.muscles.${muscle}`))
                          .join(" · ")}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal("exercise_detail", { exercise });
                    }}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors flex-shrink-0"
                    title={t("training.exercises.card.viewDetails")}
                  >
                    <Info size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <div ref={containerRef} className={className}>
      <InputField
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full"
        label={label}
        autoFocus={autoFocus}
      />
      {renderDropdown()}
    </div>
  );
};

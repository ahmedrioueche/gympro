import { type Exercise } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import { ExerciseNameAutocomplete } from "../../../../../../components/gym/ExerciseNameAutocomplete";
import type { SessionExercisePick } from "./AddSessionExercise";

interface ReplaceSessionExerciseModalProps {
  isOpen: boolean;
  exerciseName: string;
  onClose: () => void;
  onReplace: (pick: SessionExercisePick) => void;
  zIndex?: number;
}

export const ReplaceSessionExerciseModal = ({
  isOpen,
  exerciseName,
  onClose,
  onReplace,
  zIndex = 60,
}: ReplaceSessionExerciseModalProps) => {
  const { t } = useTranslation();
  const [searchName, setSearchName] = useState("");

  const pickFromLibrary = (exercise: Exercise) => {
    onReplace({
      exerciseId: exercise._id || exercise.name,
      name: exercise.name,
      videoUrl: exercise.videoUrl,
      recommendedSets: exercise.recommendedSets,
      recommendedReps: exercise.recommendedReps,
      restTime: exercise.restTime,
    });
    setSearchName("");
  };

  const pickCustom = () => {
    const name = searchName.trim();
    if (!name) return;
    onReplace({
      exerciseId: name,
      name,
      recommendedSets: 3,
      recommendedReps: 10,
    });
    setSearchName("");
  };

  return (
    <BaseModal
      isOpen={isOpen}
      zIndex={zIndex}
      onClose={() => {
        setSearchName("");
        onClose();
      }}
      title={t("training.logSession.replaceExercisePickerTitle", "Replace exercise")}
      subtitle={t(
        "training.logSession.replaceExercisePickerSubtitle",
        "Choose a replacement for \"{{name}}\" (this session only).",
        { name: exerciseName },
      )}
      showFooter={false}
    >
      <div className="space-y-4">
        <ExerciseNameAutocomplete
          value={searchName}
          onChange={setSearchName}
          onSelect={pickFromLibrary}
          placeholder={t("training.logSession.exerciseName")}
        />
        <button
          type="button"
          onClick={pickCustom}
          disabled={!searchName.trim()}
          className="w-full px-4 py-2.5 text-primary font-medium bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t(
            "training.logSession.replaceWithCustom",
            "Use \"{{name}}\"",
            { name: searchName.trim() || "…" },
          )}
        </button>
      </div>
    </BaseModal>
  );
};

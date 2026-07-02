import { type Exercise } from "@ahmedrioueche/gympro-client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ExerciseNameAutocomplete } from "../../../../../../components/gym/ExerciseNameAutocomplete";

export interface SessionExercisePick {
  exerciseId: string;
  name: string;
  videoUrl?: string;
  recommendedSets?: number;
  recommendedReps?: number;
  restTime?: number;
}

interface AddSessionExerciseProps {
  onAdd: (exercise: SessionExercisePick) => void;
}

export const AddSessionExercise = ({ onAdd }: AddSessionExerciseProps) => {
  const { t } = useTranslation();
  const [searchName, setSearchName] = useState("");

  const addFromLibrary = (exercise: Exercise) => {
    onAdd({
      exerciseId: exercise._id || exercise.name,
      name: exercise.name,
      videoUrl: exercise.videoUrl,
      recommendedSets: exercise.recommendedSets,
      recommendedReps: exercise.recommendedReps,
      restTime: exercise.restTime,
    });
    setSearchName("");
  };

  const addCustom = () => {
    const name = searchName.trim();
    if (!name) return;
    onAdd({
      exerciseId: name,
      name,
      recommendedSets: 3,
      recommendedReps: 10,
    });
    setSearchName("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 pt-2">
      <div className="flex-1">
        <ExerciseNameAutocomplete
          value={searchName}
          onChange={setSearchName}
          onSelect={addFromLibrary}
          placeholder={t("training.logSession.exerciseName")}
        />
      </div>
      <button
        type="button"
        onClick={addCustom}
        disabled={!searchName.trim()}
        className="px-4 py-2 flex items-center justify-center gap-2 text-primary font-medium bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <Plus size={16} />
        <span>{t("training.logSession.addExercise")}</span>
      </button>
    </div>
  );
};

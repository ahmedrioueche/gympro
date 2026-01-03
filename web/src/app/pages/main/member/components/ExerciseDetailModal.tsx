import { type Exercise } from "@ahmedrioueche/gympro-client";
import { PlayCircle, X } from "lucide-react";

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseDetailModal = ({
  exercise,
  isOpen,
  onClose,
}: ExerciseDetailModalProps) => {
  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-border flex justify-between items-center bg-card-header">
          <h3 className="text-lg font-semibold text-text-primary">
            {exercise.name}
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {exercise.videoUrl ? (
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-sm">
              {/* Simplified video embed or link */}
              <iframe
                src={exercise.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title={exercise.name}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center aspect-video bg-background-secondary rounded-xl text-text-secondary">
              <PlayCircle size={48} className="opacity-50" />
              <span className="ml-2">No video available</span>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary">Description</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              {exercise.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-background rounded-lg border border-border">
              <span className="text-xs text-text-secondary block">
                Target Muscles
              </span>
              <span className="text-sm font-medium capitalize text-text-primary">
                {exercise.targetMuscles?.join(", ") || "-"}
              </span>
            </div>
            <div className="p-3 bg-background rounded-lg border border-border">
              <span className="text-xs text-text-secondary block">
                Equipment
              </span>
              <span className="text-sm font-medium capitalize text-text-primary">
                {exercise.equipment?.join(", ") || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import type { ExerciseProgress } from "@ahmedrioueche/gympro-client";

/** Exercises with at least one completed set; only completed sets are kept. */
export function getCompletedSessionExercises(
  exercises: ExerciseProgress[] = [],
): ExerciseProgress[] {
  return exercises
    .map((exercise) => ({
      ...exercise,
      sets: (exercise.sets ?? []).filter((set) => set.completed),
    }))
    .filter((exercise) => exercise.sets.length > 0);
}

export function countCompletedSessionExercises(
  exercises: ExerciseProgress[] = [],
): number {
  return getCompletedSessionExercises(exercises).length;
}

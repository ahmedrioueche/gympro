import type { ExerciseProgress } from "@ahmedrioueche/gympro-client";

export type SetCompletion = { exIndex: number; setIndex: number };

/** True when completing these sets still leaves at least one set incomplete. */
export const shouldStartRestTimerAfterCompletion = (
  exercises: ExerciseProgress[],
  completions: SetCompletion[],
): boolean => {
  if (completions.length === 0) return false;

  const completing = new Set(
    completions.map((c) => `${c.exIndex}-${c.setIndex}`),
  );

  let total = 0;
  let completedAfter = 0;

  for (let i = 0; i < exercises.length; i++) {
    for (let j = 0; j < exercises[i].sets.length; j++) {
      total++;
      const alreadyDone = exercises[i].sets[j].completed;
      const willComplete = completing.has(`${i}-${j}`);
      if (alreadyDone || willComplete) {
        completedAfter++;
      }
    }
  }

  return total > 0 && completedAfter < total;
};

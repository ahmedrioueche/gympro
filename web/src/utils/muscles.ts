import type { CreateProgramDayDto } from "@ahmedrioueche/gympro-client";
import {
  MUSCLE_GROUPS,
  MUSCLE_SUBGROUPS,
} from "@ahmedrioueche/gympro-client";

export type TopLevelMuscle = (typeof MUSCLE_GROUPS)[number];

const CATEGORY_TO_MUSCLE_GROUP: Record<
  keyof typeof MUSCLE_SUBGROUPS,
  TopLevelMuscle
> = {
  chest: "chest",
  back: "back",
  shoulders: "shoulders",
  arms: "biceps",
  legs: "legs",
  glutes: "glutes",
  calves: "calves",
  core: "core",
};

/** Map subgroup/category muscle values to top-level MUSCLE_GROUPS for program storage. */
export const normalizeTargetMuscle = (
  muscle: string,
): TopLevelMuscle | null => {
  if ((MUSCLE_GROUPS as readonly string[]).includes(muscle)) {
    return muscle as TopLevelMuscle;
  }

  for (const [category, subgroups] of Object.entries(MUSCLE_SUBGROUPS) as [
    keyof typeof MUSCLE_SUBGROUPS,
    readonly string[],
  ][]) {
    if (muscle === category || subgroups.includes(muscle)) {
      return CATEGORY_TO_MUSCLE_GROUP[category];
    }
  }

  return null;
};

export const normalizeTargetMuscles = (
  muscles: string[] | undefined,
): TopLevelMuscle[] => {
  if (!muscles?.length) return [];

  const normalized = new Set<TopLevelMuscle>();
  for (const muscle of muscles) {
    const value = normalizeTargetMuscle(muscle);
    if (value) normalized.add(value);
  }
  return Array.from(normalized);
};

export const sanitizeProgramDays = (
  days: CreateProgramDayDto[] | undefined,
): CreateProgramDayDto[] | undefined => {
  if (!days) return days;

  return days.map((day) => ({
    ...day,
    blocks: day.blocks.map((block) => ({
      ...block,
      exercises: block.exercises.map((exercise) => ({
        ...exercise,
        targetMuscles: normalizeTargetMuscles(exercise.targetMuscles),
      })),
    })),
  }));
};

export const sanitizeProgramPayload = <T extends { days?: CreateProgramDayDto[] }>(
  payload: T,
): T => {
  if (!payload.days) return payload;
  return { ...payload, days: sanitizeProgramDays(payload.days) };
};

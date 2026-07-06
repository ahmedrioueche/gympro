import type { ApiResponse, Exercise, ExerciseFilters } from "@ahmedrioueche/gympro-client";

/** Client-side filters including pagination (backend + next client release). */
export interface ExerciseListFilters extends ExerciseFilters {
  page?: number;
  limit?: number;
}

export interface ExercisesPagePayload {
  data: Exercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ExercisesQueryResult = ApiResponse<ExercisesPagePayload>;

export const getExercisesPageData = (
  response?: ExercisesQueryResult | ApiResponse<Exercise[]>,
) => {
  const payload = response?.data;

  if (Array.isArray(payload)) {
    return {
      exercises: payload,
      total: payload.length,
      page: 1,
      limit: payload.length,
      totalPages: 1,
    };
  }

  return {
    exercises: payload?.data ?? [],
    total: payload?.total ?? 0,
    page: payload?.page ?? 1,
    limit: payload?.limit ?? 0,
    totalPages: payload?.totalPages ?? 1,
  };
};

export const toExerciseListFilters = (
  filters?: ExerciseListFilters,
): ExerciseFilters | undefined => {
  if (!filters) return undefined;
  return filters;
};

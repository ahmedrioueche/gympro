import type { ExerciseFilters } from "@ahmedrioueche/gympro-client";
import { useCallback, useMemo, useState } from "react";
import { EXERCISES_PAGE_SIZE } from "../constants";
import type { ExerciseListFilters } from "../../../../hooks/queries/useExercises";

type FilterKey = "targetMuscle" | "difficulty" | "type";

const EMPTY_FILTERS: Pick<ExerciseFilters, FilterKey> = {};

export function useExercisesPage() {
  const [filters, setFilters] =
    useState<Pick<ExerciseFilters, FilterKey>>(EMPTY_FILTERS);
  const [searchQuery, setSearchQueryState] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const queryFilters = useMemo<ExerciseListFilters>(
    () => ({
      ...filters,
      search: searchQuery.trim() || undefined,
      page: currentPage,
      limit: EXERCISES_PAGE_SIZE,
    }),
    [currentPage, filters, searchQuery],
  );

  const hasActiveFilters = useMemo(
    () =>
      Boolean(searchQuery.trim()) ||
      Object.values(filters).some((value) => Boolean(value)),
    [filters, searchQuery],
  );

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const setSearchQuery = useCallback(
    (value: string) => {
      setSearchQueryState(value);
      resetPage();
    },
    [resetPage],
  );

  const setFilter = useCallback(
    (key: FilterKey, value: ExerciseFilters[FilterKey]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
      resetPage();
    },
    [resetPage],
  );

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSearchQueryState("");
    resetPage();
  }, [resetPage]);

  return {
    filters,
    searchQuery,
    currentPage,
    queryFilters,
    hasActiveFilters,
    setSearchQuery,
    setFilter,
    clearFilters,
    setCurrentPage,
  };
}

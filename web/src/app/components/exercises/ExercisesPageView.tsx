import {
  EXERCISE_DIFFICULTIES,
  EXERCISE_TYPES,
  MUSCLE_GROUPS,
  type Exercise,
  type ExerciseFilters,
} from "@ahmedrioueche/gympro-client";
import { Dumbbell, Plus } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../components/ui/Loading";
import NoData from "../../../components/ui/NoData";
import Pagination from "../../../components/ui/Pagination";
import { SearchFilterBar } from "../../../components/ui/SearchFilterBar";
import {
  useDeleteExercise,
  useExercises,
} from "../../../hooks/queries/useExercises";
import { getExercisesPageData } from "../../../hooks/queries/exercisesQueryUtils";
import { useModalStore } from "../../../store/modal";
import { useUserStore } from "../../../store/user";
import { ExercisesList } from "../gym/ExercisesList";
import PageHeader from "../PageHeader";
import { EXERCISES_PAGE_SIZE } from "./constants";
import { useExercisesPage } from "./hooks/useExercisesPage";

export function ExercisesPageView() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { openModal } = useModalStore();
  const deleteExercise = useDeleteExercise();

  const {
    filters,
    searchQuery,
    currentPage,
    queryFilters,
    hasActiveFilters,
    setSearchQuery,
    setFilter,
    clearFilters,
    setCurrentPage,
  } = useExercisesPage();

  const { data: response, isLoading } = useExercises(queryFilters);
  const { exercises, total, totalPages } = getExercisesPageData(response);

  const startIndex = (currentPage - 1) * EXERCISES_PAGE_SIZE;
  const endIndex = Math.min(startIndex + exercises.length, total);

  const handleCreateClick = useCallback(() => {
    openModal("create_exercise");
  }, [openModal]);

  const handleEditClick = useCallback(
    (exercise: Exercise) => {
      openModal("create_exercise", { exerciseToEdit: exercise });
    },
    [openModal],
  );

  const handleDeleteClick = useCallback(
    (exercise: Exercise) => {
      openModal("confirm", {
        title: t("training.exercises.deleteConfirm"),
        text: t("training.exercises.deleteWarning"),
        onConfirm: async () => {
          await deleteExercise.mutateAsync(exercise._id);
        },
      });
    },
    [deleteExercise, openModal, t],
  );

  const handleCardClick = useCallback(
    (exercise: Exercise) => {
      openModal("exercise_detail", {
        exercise,
        currentUserId: user?._id || "",
      });
    },
    [openModal, user?._id],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setCurrentPage],
  );

  const filterConfigs = useMemo(
    () => [
      {
        value: filters.targetMuscle || "",
        onChange: (val: string) =>
          setFilter("targetMuscle", (val || undefined) as ExerciseFilters["targetMuscle"]),
        options: [
          { value: "", label: t("training.exercises.filters.targetMuscle") },
          ...MUSCLE_GROUPS.map((m) => ({ value: m, label: m })),
        ],
      },
      {
        value: filters.difficulty || "",
        onChange: (val: string) =>
          setFilter("difficulty", (val || undefined) as ExerciseFilters["difficulty"]),
        options: [
          { value: "", label: t("training.exercises.filters.difficulty") },
          ...EXERCISE_DIFFICULTIES.map((d) => ({
            value: d,
            label: t(`training.exercises.difficulty.${d}`),
          })),
        ],
      },
      {
        value: filters.type || "",
        onChange: (val: string) =>
          setFilter("type", (val || undefined) as ExerciseFilters["type"]),
        options: [
          { value: "", label: t("training.exercises.filters.type") },
          ...EXERCISE_TYPES.map((type) => ({
            value: type,
            label: type,
          })),
        ],
      },
    ],
    [filters.difficulty, filters.targetMuscle, filters.type, setFilter, t],
  );

  const showEmptyCreateAction = !hasActiveFilters;
  const showNoResults = !isLoading && exercises.length === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 min-h-screen">
      <PageHeader
        title={t("training.exercises.title")}
        subtitle={t("training.exercises.subtitle")}
        icon={Dumbbell}
        actionButton={{
          label: t("training.exercises.create"),
          icon: Plus,
          onClick: handleCreateClick,
          show: true,
        }}
      />

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("training.exercises.search")}
        filters={filterConfigs}
      />

      {isLoading ? (
        <Loading className="py-20" />
      ) : showNoResults ? (
        <NoData
          icon={Dumbbell}
          title={t("training.exercises.empty.title")}
          description={t("training.exercises.empty.description")}
          actionButton={
            showEmptyCreateAction
              ? {
                  label: t("training.exercises.create"),
                  icon: Plus,
                  onClick: handleCreateClick,
                }
              : {
                  label: t("training.exercises.filters.clear"),
                  onClick: clearFilters,
                  className:
                    "text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline",
                }
          }
        />
      ) : (
        <>
          <ExercisesList
            exercises={exercises}
            isLoading={false}
            currentUserId={user?._id || ""}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onClick={handleCardClick}
            onCreateClick={handleCreateClick}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={total}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

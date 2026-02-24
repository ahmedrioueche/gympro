import {
  EXERCISE_DIFFICULTIES,
  EXERCISE_TYPES,
  MUSCLE_GROUPS,
  type Exercise,
  type ExerciseFilters,
} from "@ahmedrioueche/gympro-client";
import { Dumbbell, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import { SearchFilterBar } from "../../../../../components/ui/SearchFilterBar";
import {
  useDeleteExercise,
  useExercises,
} from "../../../../../hooks/queries/useExercises";
import { useModalStore } from "../../../../../store/modal";
import { useUserStore } from "../../../../../store/user";
import { ExercisesList } from "../../../../components/gym/ExercisesList";
import PageHeader from "../../../../components/PageHeader";

export default function ExercisesPage() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { openModal } = useModalStore();
  const [filters, setFilters] = useState<ExerciseFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  // Queries & Mutations
  const { data: response, isLoading } = useExercises({
    ...filters,
    search: searchQuery || undefined,
  });
  const exercises = response?.data || [];
  const deleteExercise = useDeleteExercise();

  const handleCreateClick = () => {
    openModal("create_exercise");
  };

  const handleEditClick = (exercise: Exercise) => {
    openModal("create_exercise", { exerciseToEdit: exercise });
  };

  const handleDeleteClick = async (exercise: Exercise) => {
    openModal("confirm", {
      title: t("training.exercises.deleteConfirm"),
      text: t("training.exercises.deleteWarning"),
      onConfirm: async () => {
        await deleteExercise.mutateAsync(exercise._id);
      },
    });
  };

  const handleCardClick = (exercise: Exercise) => {
    openModal("exercise_detail", {
      exercise,
      currentUserId: user?._id || "",
    });
  };

  const filterConfigs = [
    {
      value: filters.targetMuscle || "",
      onChange: (val: string) =>
        setFilters({ ...filters, targetMuscle: (val as any) || undefined }),
      options: [
        { value: "", label: t("training.exercises.filters.targetMuscle") },
        ...MUSCLE_GROUPS.map((m) => ({ value: m, label: m })),
      ],
    },
    {
      value: filters.difficulty || "",
      onChange: (val: string) =>
        setFilters({ ...filters, difficulty: (val as any) || undefined }),
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
        setFilters({ ...filters, type: (val as any) || undefined }),
      options: [
        { value: "", label: t("training.exercises.filters.type") },
        ...EXERCISE_TYPES.map((type) => ({
          value: type,
          label: type,
        })),
      ],
    },
  ];

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

      {/* Filters & Search - Use consistent SearchFilterBar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("training.exercises.search")}
        filters={filterConfigs}
      />

      {/* Content */}
      {isLoading ? (
        <Loading className="py-20" />
      ) : !exercises || exercises.length === 0 ? (
        <NoData
          icon={Dumbbell}
          title={t("training.exercises.empty.title")}
          description={t("training.exercises.empty.description")}
          actionButton={
            (searchQuery === "" && Object.keys(filters).length === 0) ||
            Object.values(filters).every((v) => !v)
              ? {
                  label: t("training.exercises.create"),
                  icon: Plus,
                  onClick: handleCreateClick,
                }
              : {
                  label: t("training.exercises.filters.clear"),
                  onClick: () => {
                    setFilters({});
                    setSearchQuery("");
                  },
                  className:
                    "text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline",
                }
          }
        />
      ) : (
        <ExercisesList
          exercises={exercises}
          isLoading={isLoading}
          currentUserId={user?._id || ""}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onClick={handleCardClick}
          onCreateClick={handleCreateClick}
        />
      )}
    </div>
  );
}

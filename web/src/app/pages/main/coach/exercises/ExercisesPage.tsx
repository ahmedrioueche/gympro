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
import CustomSelect from "../../../../../components/ui/CustomSelect";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import { SearchInput } from "../../../../../components/ui/SearchInput";
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

  // Convert constants to options for CustomSelect, filtering out generic "all" where applicable or adding it
  const muscleOptions = [
    { value: "", label: t("training.exercises.filters.targetMuscle") },
    ...MUSCLE_GROUPS.map((m) => ({ value: m, label: m })),
  ];

  const difficultyOptions = [
    { value: "", label: t("training.exercises.filters.difficulty") },
    ...EXERCISE_DIFFICULTIES.map((d) => ({
      value: d,
      label: t(`training.exercises.difficulty.${d}`),
    })),
  ];

  const typeOptions = [
    { value: "", label: t("training.exercises.filters.type") },
    ...EXERCISE_TYPES.map((type) => ({
      value: type,
      label: type, // You might want to translate these types if keys exist
    })),
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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

      {/* Filters & Search */}
      <div className="bg-surface border border-border rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="w-full lg:w-1/3">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("training.exercises.search")}
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full lg:w-2/3">
            <CustomSelect
              title=""
              options={muscleOptions}
              selectedOption={filters.targetMuscle || ""}
              onChange={(val) =>
                setFilters({ ...filters, targetMuscle: val as any })
              }
              placeholder={t("training.exercises.filters.targetMuscle")}
              marginTop="mt-0"
            />
            <CustomSelect
              title=""
              options={difficultyOptions}
              selectedOption={filters.difficulty || ""}
              onChange={(val) =>
                setFilters({ ...filters, difficulty: val as any })
              }
              placeholder={t("training.exercises.filters.difficulty")}
              marginTop="mt-0"
            />
            <CustomSelect
              title=""
              options={typeOptions}
              selectedOption={filters.type || ""}
              onChange={(val) => setFilters({ ...filters, type: val as any })}
              placeholder={t("training.exercises.filters.type")}
              marginTop="mt-0"
            />
          </div>
        </div>
      </div>

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

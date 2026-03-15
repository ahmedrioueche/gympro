import {
  exercisesApi,
  type CreateExerciseDto,
  type ExerciseFilters,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { showStatusToast } from "../../utils/statusMessage";

export const useExercises = (filters?: ExerciseFilters) => {
  return useQuery({
    queryKey: ["exercises", filters],
    queryFn: () => exercisesApi.getExercises(filters),
  });
};

export const useGetExercise = (id: string) => {
  return useQuery({
    queryKey: ["exercises", id],
    queryFn: () => exercisesApi.getExerciseById(id),
    enabled: !!id,
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateExerciseDto) => exercisesApi.createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success(t("status.success.exercise_created"));
    },
    onError: (error: any) => {
      showStatusToast(
        {
          status: "error",
          message: error.response?.data?.message || t("status.error.exercise.create_failed"),
        },
        toast
      );
    },
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateExerciseDto>;
    }) => exercisesApi.updateExercise(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["exercises", res.data._id] });
      toast.success(t("status.success.exercise_updated"));
    },
    onError: (error: any) => {
      showStatusToast(
        {
          status: "error",
          message: error.response?.data?.message || t("status.error.exercise.update_failed"),
        },
        toast
      );
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => exercisesApi.deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success(t("status.success.exercise_deleted"));
    },
    onError: (error: any) => {
      showStatusToast(
        {
          status: "error",
          message: error.response?.data?.message || t("status.error.exercise.delete_failed"),
        },
        toast
      );
    },
  });
};

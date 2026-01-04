import {
  exercisesApi,
  type CreateExerciseDto,
  type ExerciseFilters,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
  return useMutation({
    mutationFn: (data: CreateExerciseDto) => exercisesApi.createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success("Exercise created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create exercise");
    },
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
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
      toast.success("Exercise updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update exercise");
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => exercisesApi.deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success("Exercise deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete exercise");
    },
  });
};

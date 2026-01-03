import {
  type CreateProgramDto,
  type LogSessionDto,
  trainingApi,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePrograms = (filters?: { source?: string; search?: string }) => {
  return useQuery({
    queryKey: ["programs", filters],
    queryFn: async () => {
      const { data } = await trainingApi.getPrograms(
        filters?.source,
        filters?.search
      );
      return data;
    },
  });
};

export const useProgram = (id: string) => {
  return useQuery({
    queryKey: ["program", id],
    queryFn: async () => {
      const { data } = await trainingApi.getProgram(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useActiveProgram = () => {
  return useQuery({
    queryKey: ["activeProgram"],
    queryFn: async () => {
      const { data } = await trainingApi.getActiveProgram();
      return data;
    },
  });
};

export const useTrainingHistory = () => {
  return useQuery({
    queryKey: ["trainingHistory"],
    queryFn: async () => {
      const { data } = await trainingApi.getHistory();
      return data;
    },
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProgramDto) => trainingApi.createProgram(data),
    onSuccess: () => {
      toast.success("Program created successfully");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create program");
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateProgramDto>;
    }) => trainingApi.updateProgram(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["program"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update program");
    },
  });
};

export const useStartProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trainingApi.startProgram(id),
    onSuccess: () => {
      toast.success("Program started");
      queryClient.invalidateQueries({ queryKey: ["activeProgram"] });
      queryClient.invalidateQueries({ queryKey: ["trainingHistory"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to start program");
    },
  });
};

export const useLogSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LogSessionDto) => trainingApi.logSession(data),
    onSuccess: () => {
      toast.success("Session logged successfully");
      queryClient.invalidateQueries({ queryKey: ["activeProgram"] });
      queryClient.invalidateQueries({ queryKey: ["trainingHistory"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to log session");
    },
  });
};

import {
  type CreateProgramDto,
  type LogSessionDto,
  trainingApi,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { showStatusToast } from "../../utils/statusMessage";

export const usePrograms = (filters?: { source?: string; search?: string }) => {
  return useQuery({
    queryKey: ["programs", filters],
    queryFn: async () => {
      const { data } = await trainingApi.getPrograms(
        filters?.source,
        filters?.search,
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
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateProgramDto) => trainingApi.createProgram(data),
    onSuccess: () => {
      toast.success(t("status.success.program_created"));
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error: any) => {
      showStatusToast(
        {
          status: "error",
          message: error.response?.data?.message || t("status.error.program.create_failed"),
        },
        toast
      );
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
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
      queryClient.invalidateQueries({ queryKey: ["activeProgram"] });
      queryClient.invalidateQueries({ queryKey: ["trainingHistory"] });
    },
    onError: (error: any) => {
      toast.error(error.message || t("status.error.program.update_failed"));
    },
  });
};

export const useStartProgram = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, force }: { id: string; force?: boolean }) =>
      trainingApi.startProgram(id, force),
    onSuccess: () => {
      toast.success(t("status.success.program_started"));
      queryClient.invalidateQueries({ queryKey: ["activeProgram"] });
      queryClient.invalidateQueries({ queryKey: ["trainingHistory"] });
    },
    onError: (error: any) => {
      showStatusToast(
        {
          status: "error",
          message: error.response?.data?.message || t("status.error.program.start_failed"),
        },
        toast
      );
    },
  });
};

export const useAbandonProgram = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => trainingApi.abandonProgram(),
    onSuccess: () => {
      toast.success(t("status.success.program_archived"));
      queryClient.invalidateQueries({ queryKey: ["activeProgram"] });
      queryClient.invalidateQueries({ queryKey: ["trainingHistory"] });
    },
    onError: (error: any) => {
      showStatusToast(
        {
          status: "error",
          message: error.response?.data?.message || t("status.error.program.archive_failed"),
        },
        toast
      );
    },
  });
};

export const useResumeHistory = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => trainingApi.resumeHistory(id),
    onSuccess: () => {
      toast.success(t("status.success.program_restarted"));
      queryClient.invalidateQueries({ queryKey: ["activeProgram"] });
      queryClient.invalidateQueries({ queryKey: ["trainingHistory"] });
    },
    onError: (error: any) => {
      showStatusToast(
        {
          status: "error",
          message: error.response?.data?.message || t("status.error.program.restart_failed"),
        },
        toast
      );
    },
  });
};

export const useLogSession = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: LogSessionDto & { silent?: boolean }) => {
      const { silent: _silent, ...payload } = data;
      return trainingApi.logSession(payload);
    },
    onSuccess: (_data, variables) => {
      if (!variables.silent) {
        toast.success(t("status.success.session_logged"));
      }
      queryClient.invalidateQueries({ queryKey: ["activeProgram"] });
      queryClient.invalidateQueries({ queryKey: ["trainingHistory"] });
    },
    onError: (error: any) => {
      toast.error(error.message || t("status.error.unexpected"));
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      programId,
      sessionId,
    }: {
      programId: string;
      sessionId: string;
    }) => trainingApi.deleteSession(programId, sessionId),
    onSuccess: () => {
      toast.success(t("status.success.session_deleted"));
      queryClient.invalidateQueries({ queryKey: ["activeProgram"] });
      queryClient.invalidateQueries({ queryKey: ["trainingHistory"] });
    },
    onError: (error: any) => {
      toast.error(error.message || t("status.error.unexpected"));
    },
  });
};

export const useAutoSaveSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LogSessionDto) => trainingApi.logSession(data),
    onSuccess: () => {
      // Silent success
      queryClient.invalidateQueries({ queryKey: ["activeProgram"] });
      queryClient.invalidateQueries({ queryKey: ["trainingHistory"] });
    },
    onError: (error: any) => {
      // Optional: show error or retry silently? Better to show error if save fails.
      console.error("Auto-save failed", error);
    },
  });
};

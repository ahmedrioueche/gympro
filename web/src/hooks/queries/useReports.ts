import {
  adminApi,
  reportsApi,
  type AddReportResponseDto,
  type CreateReportDto,
  type Report,
  type ReportStatus,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getMessage, showStatusToast } from "../../utils/statusMessage";

export const useAdminReports = () => {
  return useQuery({
    queryKey: ["admin", "reports"],
    queryFn: async () => {
      const response = await adminApi.getReports();
      return response;
    },
  });
};

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ReportStatus;
    }) => {
      const response = await adminApi.updateReportStatus(id, status);
      const msg = getMessage(response, t);
      showStatusToast(msg, toast);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports", "my"] });
    },
  });
};

// User-facing hooks
export const useMyReports = () => {
  return useQuery<Report[]>({
    queryKey: ["reports", "my"],
    queryFn: async () => {
      const response = await reportsApi.getMyReports();
      return response.data ?? [];
    },
  });
};

export const useReport = (id: string | undefined) => {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await reportsApi.getReport(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data: CreateReportDto) => {
      const response = await reportsApi.createReport(data);
      const msg = getMessage(response, t);
      showStatusToast(msg, toast);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "my"] });
    },
  });
};

export const useAddResponse = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({
      reportId,
      data,
    }: {
      reportId: string;
      data: AddReportResponseDto;
    }) => {
      const response = await reportsApi.addResponse(reportId, data);
      const msg = getMessage(response, t);
      showStatusToast(msg, toast);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports", "my"] });
    },
  });
};

export const useAddAttachments = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({
      reportId,
      attachments,
    }: {
      reportId: string;
      attachments: string[];
    }) => {
      const response = await reportsApi.addAttachments(reportId, attachments);
      const msg = getMessage(response, t);
      showStatusToast(msg, toast);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports", "my"] });
    },
  });
};

import { adminApi, type ReportStatus } from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ReportStatus;
    }) => {
      return adminApi.updateReportStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
};

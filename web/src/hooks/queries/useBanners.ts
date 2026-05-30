import {
  getAuthToken,
  UserRole,
  type ApiResponse,
  type AppBanner,
  type CreateAppBannerDto,
  type UpdateAppBannerDto,
  getApiClient,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../store/user";

export const bannersApi = {
  getActive: async (): Promise<ApiResponse<AppBanner[]>> => {
    const { data } = await getApiClient().get("/system-alerts/active");
    return data;
  },
  getAll: async (): Promise<ApiResponse<AppBanner[]>> => {
    const { data } = await getApiClient().get("/system-alerts");
    return data;
  },
  create: async (dto: CreateAppBannerDto): Promise<ApiResponse<AppBanner>> => {
    const { data } = await getApiClient().post("/system-alerts", dto);
    return data;
  },
  update: async (
    id: string,
    dto: UpdateAppBannerDto,
  ): Promise<ApiResponse<AppBanner>> => {
    const { data } = await getApiClient().patch(`/system-alerts/${id}`, dto);
    return data;
  },
  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await getApiClient().delete(`/system-alerts/${id}`);
    return data;
  },
};

export const useActiveBanners = () => {
  const isLanding = window.location.pathname.startsWith("/landing");
  const { isAuthenticated, user } = useUserStore();

  const isAdminRole =
    user?.role === UserRole.Admin ||
    user?.role === UserRole.AppEditor ||
    user?.role === UserRole.Manager ||
    user?.role === UserRole.Owner;

  return useQuery({
    queryKey: ["active_banners"],
    queryFn: bannersApi.getActive,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    enabled:
      !isLanding &&
      isAuthenticated &&
      isAdminRole &&
      !!getAuthToken() &&
      !!user,
  });
};

export const useAdminBanners = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isLanding = window.location.pathname.startsWith("/landing");
  const { isAuthenticated, user } = useUserStore();

  const isAdminRole =
    user?.role === UserRole.Admin ||
    user?.role === UserRole.AppEditor ||
    user?.role === UserRole.Manager ||
    user?.role === UserRole.Owner;

  const bannersQuery = useQuery({
    queryKey: ["admin_banners"],
    queryFn: bannersApi.getAll,
    enabled:
      !isLanding &&
      isAuthenticated &&
      isAdminRole &&
      !!getAuthToken() &&
      !!user,
  });

  const createMutation = useMutation({
    mutationFn: bannersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_banners"] });
      queryClient.invalidateQueries({ queryKey: ["active_banners"] });
      toast.success(t("status.success.operation_completed"));
    },
    onError: () => {
      toast.error(t("status.error.unexpected"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAppBannerDto }) =>
      bannersApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_banners"] });
      queryClient.invalidateQueries({ queryKey: ["active_banners"] });
      toast.success(t("status.success.operation_completed"));
    },
    onError: () => {
      toast.error(t("status.error.unexpected"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: bannersApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_banners"] });
      queryClient.invalidateQueries({ queryKey: ["active_banners"] });
      toast.success(t("status.success.operation_completed"));
    },
    onError: () => {
      toast.error(t("status.error.unexpected"));
    },
  });

  return {
    banners: Array.isArray(bannersQuery.data)
      ? bannersQuery.data
      : Array.isArray((bannersQuery.data as any)?.data)
        ? (bannersQuery.data as any).data
        : [],
    isLoading: bannersQuery.isLoading,
    createBanner: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateBanner: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteBanner: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};

import {
  type CreateSubscriptionTypeDto,
  subscriptionApi,
  type UpdateSubscriptionTypeDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../../store/gym";

export const subscriptionKeys = {
  all: ["subscriptionTypes"] as const,
  lists: () => [...subscriptionKeys.all, "list"] as const,
  list: (gymId: string) => [...subscriptionKeys.lists(), gymId] as const,
};

export function useSubscriptionTypes() {
  const { currentGym } = useGymStore();
  const gymId = currentGym?._id;

  return useQuery({
    queryKey: subscriptionKeys.list(gymId || ""),
    queryFn: () => subscriptionApi.getSubscriptionTypes(gymId!),
    enabled: !!gymId,
    select: (data) => data.data,
  });
}

export function useManageSubscriptionType() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentGym } = useGymStore();
  const gymId = currentGym?._id;

  const createMutation = useMutation({
    mutationFn: (dto: CreateSubscriptionTypeDto) =>
      subscriptionApi.createSubscriptionType(gymId!, dto),
    onSuccess: () => {
      toast.success(t("pricing.success.created"));
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.list(gymId || ""),
      });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("pricing.error.create_failed")
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSubscriptionTypeDto }) =>
      subscriptionApi.updateSubscriptionType(gymId!, id, dto),
    onSuccess: () => {
      toast.success(t("pricing.success.updated"));
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.list(gymId || ""),
      });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("pricing.error.update_failed")
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      subscriptionApi.deleteSubscriptionType(gymId!, id),
    onSuccess: () => {
      toast.success(t("pricing.success.deleted"));
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.list(gymId || ""),
      });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("pricing.error.delete_failed")
      );
    },
  });

  return {
    createSubscriptionType: createMutation.mutateAsync,
    updateSubscriptionType: updateMutation.mutateAsync,
    deleteSubscriptionType: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

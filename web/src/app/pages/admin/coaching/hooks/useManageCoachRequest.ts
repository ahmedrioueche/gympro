import { adminApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useManageCoachRequest = () => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: adminApi.approveCoachRequest,
    onSuccess: () => {
      toast.success("Coach request approved successfully");
      queryClient.invalidateQueries({ queryKey: ["coachRequests"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve coach request");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: adminApi.rejectCoachRequest,
    onSuccess: () => {
      toast.success("Coach request rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["coachRequests"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject coach request");
    },
  });

  return {
    approveRequest: approveMutation.mutate,
    isApproving: approveMutation.isPending,
    rejectRequest: rejectMutation.mutate,
    isRejecting: rejectMutation.isPending,
  };
};

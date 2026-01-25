import { gymCoachApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../../constants/navigation";
import { useGymStore } from "../../../../../../../store/gym";

export function useGymCoachSettings() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all affiliations and find the one for the current gym
  const { data: affiliations, isLoading } = useQuery({
    queryKey: ["coach-gyms"],
    queryFn: async () => {
      const response = await gymCoachApi.getCoachGyms();
      return response.data;
    },
  });

  const currentAffiliation = affiliations?.find(
    (a) => a.gymId === currentGym?._id,
  );

  // Terminate Affiliation (Leave Gym)
  const terminateMutation = useMutation({
    mutationFn: async (affiliationId: string) => {
      const response = await gymCoachApi.terminateAffiliation(affiliationId);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("coach.settings.gym.leaveSuccess"));
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["coach-gyms"] });
      // Redirect to home or another page since they are no longer part of this gym
      navigate({ to: APP_PAGES.coach.home.link });
    },
    onError: (error: any) => {
      toast.error(error.message || t("common.errorOccurred"));
    },
  });

  const handleLeaveGym = () => {
    if (!currentAffiliation) return;

    // We rely on the UI to show a confirmation modal before calling this
    terminateMutation.mutate(currentAffiliation._id);
  };

  return {
    affiliation: currentAffiliation,
    isLoading,
    isLeaving: terminateMutation.isPending,
    handleLeaveGym,
  };
}

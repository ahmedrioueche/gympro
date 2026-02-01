import {
  adminApi,
  type CoachProfile,
  type CoachUser,
  type User,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../components/ui/Error";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import { useModalStore } from "../../../../../store/modal";
import CoachCard from "../../../../components/cards/CoachCard";
import { useCoaches } from "../hooks/useCoaches";

export default function CoachListTab() {
  const { t } = useTranslation();
  const { data: coaches, isLoading, error } = useCoaches();

  const { openModal } = useModalStore();

  const queryClient = useQueryClient();

  const handleViewDetails = (coach: CoachProfile) => {
    console.log("handleViewDetails");
    openModal("coach_profile", { coach });
  };

  const { mutate: removeCoach } = useMutation({
    mutationFn: adminApi.removeCoach,
    onSuccess: () => {
      toast.success(t("coaches.coachRemoved", "Coach removed successfully"));
      queryClient.invalidateQueries({ queryKey: ["adminCoaches"] });
    },
    onError: (error: any) => {
      toast.error(error.message || t("common.error", "An error occurred"));
    },
  });

  const handleRemoveCoach = useCallback(
    (userId: string) => {
      openModal("confirm", {
        title: t("coaches.confirmRemoveTitle", "Remove Coach"),
        message: t(
          "coaches.confirmRemove",
          "Are you sure you want to remove this coach? This action cannot be undone.",
        ),
        confirmLabel: t("common.delete", "Delete"),
        cancelLabel: t("common.cancel", "Cancel"),
        onConfirm: () => removeCoach(userId),
        confirmVariant: "danger",
      });
    },
    [openModal, removeCoach, t],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <ErrorComponent />
      </div>
    );
  }

  if (!coaches || coaches.length === 0) {
    return (
      <NoData title={t("coaches.noCoachesFound", "No active coaches found.")} />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coaches.map((user: User) => {
        // Safe cast to access coach-specific fields
        const coachUser = user as CoachUser;
        const info = coachUser.coachingInfo;

        const coachProfile: CoachProfile = {
          userId: user._id,
          username: user.profile.username,
          fullName: user.profile.fullName || user.profile.username,
          profileImageUrl: user.profile.profileImageUrl,
          bio: info?.bio || user.profile.bio,
          specializations: info?.specializations || [],
          yearsOfExperience: info?.yearsOfExperience,
          isVerified: user.coachVerification?.status === "approved",
          rating: info?.rating,
          totalClients: info?.coachedMembers?.length || 0,
          location: {
            city: user.profile.city,
            state: user.profile.state,
            country: user.profile.country,
          },
        };

        return (
          <CoachCard
            key={user._id}
            coach={coachProfile}
            isActive={true}
            onViewDetails={handleViewDetails}
            onRemove={() => handleRemoveCoach(user._id)}
          />
        );
      })}
    </div>
  );
}

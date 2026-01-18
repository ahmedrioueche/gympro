import type { GymCoachAffiliation } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGymCoaches,
  useRespondToAffiliation,
  useTerminateAffiliation,
} from "../../../../../../../hooks/queries/useGymCoach";
import { useGymStore } from "../../../../../../../store/gym";
import { useModalStore } from "../../../../../../../store/modal";

export function useCoachingPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { openModal } = useModalStore();
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "invites">(
    "active"
  );

  const {
    data: affiliations = [],
    isLoading,
    refetch,
  } = useGymCoaches(currentGym?._id);
  const respondToAffiliation = useRespondToAffiliation();
  const terminateAffiliation = useTerminateAffiliation();

  const activeCoaches = affiliations.filter(
    (a: GymCoachAffiliation) => a.status === "active"
  );
  // Pending requests from coaches (coach initiated, gym hasn't responded)
  const pendingRequests = affiliations.filter(
    (a: GymCoachAffiliation) =>
      a.status === "pending" && a.initiatedBy === "coach"
  );
  // Pending invites sent by gym (gym initiated, coach hasn't responded)
  const pendingInvites = affiliations.filter(
    (a: GymCoachAffiliation) =>
      a.status === "pending" && a.initiatedBy === "gym"
  );

  const handleAccept = async (affiliationId: string) => {
    try {
      await respondToAffiliation.mutateAsync({ affiliationId, accept: true });
      refetch();
    } catch (error) {
      console.error("Failed to accept:", error);
    }
  };

  const handleDecline = async (affiliationId: string) => {
    try {
      await respondToAffiliation.mutateAsync({ affiliationId, accept: false });
      refetch();
    } catch (error) {
      console.error("Failed to decline:", error);
    }
  };

  const handleRemove = (affiliationId: string, coachName: string) => {
    openModal("confirm", {
      title: t("coaching.removeCoachTitle"),
      text: t("coaching.removeCoachConfirm", { name: coachName }),
      verificationText: coachName,
      confirmVariant: "danger",
      confirmText: t("coaching.removeCoach"),
      onConfirm: async () => {
        try {
          await terminateAffiliation.mutateAsync(affiliationId);
          refetch();
        } catch (error) {
          console.error("Failed to remove:", error);
        }
      },
    });
  };

  const handleInviteCoach = () => {
    if (currentGym?._id) {
      openModal("invite_coach", { gymId: currentGym._id, onSuccess: refetch });
    }
  };

  return {
    activeTab,
    setActiveTab,
    activeCoaches,
    pendingRequests,
    pendingInvites,
    isLoading,
    handleAccept,
    handleDecline,
    handleRemove,
    handleInviteCoach,
  };
}

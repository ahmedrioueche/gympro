import { Dumbbell } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import { useRequestGymAffiliation } from "../../../../../hooks/queries/useGymCoach";
import { useModalStore } from "../../../../../store/modal";
import PageHeader from "../../../../components/PageHeader";
import GymList from "../../../../components/gym/GymList";
import GymDiscovery from "../../../../components/gyms/GymDiscovery";
import { CoachGymsTabs } from "./components/CoachGymsTabs";
import { InvitationsList } from "./components/InvitationsList";
import { useCoachGymsPage } from "./hooks/useCoachGymsPage";

export default function GymsPage() {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    activeAffiliations,
    pendingInvitations,
    exploreCount,
    isAffiliationsLoading,
    affiliations,
  } = useCoachGymsPage();

  const { openModal } = useModalStore();
  const requestAffiliation = useRequestGymAffiliation();

  const handleRequestAffiliation = async (gymId: string) => {
    // 1. Check if ANY affiliation exists for this gym (active, pending, etc.)
    const hasExistingAffiliation = affiliations.some(
      (a) => a.gymId === gymId || a.gym?._id === gymId,
    );

    if (hasExistingAffiliation) return;

    openModal("confirm", {
      title: t("coach.gyms.confirmTitle", "Request Affiliation?"),
      text: t(
        "coach.gyms.confirmText",
        "Would you like to request to join this gym as a coach?",
      ),
      confirmText: t("common.confirm"),
      onConfirm: async () => {
        try {
          await requestAffiliation.mutateAsync({ gymId });
          toast.success(t("coach.gyms.requestSent"));
        } catch (error: any) {
          toast.error(error.message || t("common.error"));
        }
      },
    });
  };

  // Get gyms from affiliations for GymList
  const affiliatedGyms = activeAffiliations
    .map((a) => a.gym)
    .filter((g): g is NonNullable<typeof g> => !!g);

  const isLoading = isAffiliationsLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("coach.gyms.title")}
        subtitle={t("coach.gyms.subtitle")}
        icon={Dumbbell}
      />

      <CoachGymsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        affiliationsCount={activeAffiliations.length}
        invitationsCount={pendingInvitations.length}
        exploreCount={exploreCount}
      />

      {isLoading ? (
        <div className="py-20">
          <Loading />
        </div>
      ) : (
        <>
          {activeTab === "affiliations" && (
            <GymList gyms={affiliatedGyms as any[]} isLoading={false} />
          )}

          {activeTab === "invitations" && (
            <InvitationsList invitations={pendingInvitations} />
          )}

          {activeTab === "explore" && (
            <GymDiscovery
              onGymJoin={(gym) => handleRequestAffiliation(gym._id)}
            />
          )}
        </>
      )}
    </div>
  );
}

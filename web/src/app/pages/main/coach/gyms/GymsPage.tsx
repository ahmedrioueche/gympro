import { Dumbbell } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import { useRequestGymAffiliation } from "../../../../../hooks/queries/useGymCoach";
import PageHeader from "../../../../components/PageHeader";
import GymList from "../../../../components/gym/GymList";
import { CoachGymsTabs } from "./components/CoachGymsTabs";
import { ExploreGyms } from "./components/ExploreGyms";
import { InvitationsList } from "./components/InvitationsList";
import { useCoachGymsPage } from "./hooks/useCoachGymsPage";

export default function GymsPage() {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    activeAffiliations,
    pendingInvitations,
    exploreGyms,
    isAffiliationsLoading,
    isGymsLoading,
  } = useCoachGymsPage();

  const requestAffiliation = useRequestGymAffiliation();

  const handleRequestAffiliation = async (gymId: string) => {
    try {
      await requestAffiliation.mutateAsync({ gymId });
      toast.success(t("coach.gyms.requestSent"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  // Get gyms from affiliations for GymList
  const affiliatedGyms = activeAffiliations
    .map((a) => a.gym)
    .filter((g): g is NonNullable<typeof g> => !!g);

  const isLoading = isAffiliationsLoading || isGymsLoading;

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
        exploreCount={exploreGyms.length}
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
            <ExploreGyms
              gyms={exploreGyms}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onRequestAffiliation={handleRequestAffiliation}
            />
          )}
        </>
      )}
    </div>
  );
}

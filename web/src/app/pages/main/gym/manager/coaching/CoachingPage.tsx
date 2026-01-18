import { UserPlus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import PageHeader from "../../../../../components/PageHeader";
import { CoachingTabs } from "./components/CoachingTabs";
import { CoachList } from "./components/CoachList";
import { useCoachingPage } from "./hooks/useCoachingPage";

export default function CoachingPage() {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    activeCoaches,
    pendingRequests,
    isLoading,
    handleAccept,
    handleDecline,
    handleRemove,
    handleInviteCoach,
    pendingInvites,
  } = useCoachingPage();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("coaching.title")}
          subtitle={t("coaching.subtitle")}
          icon={Users}
        />
        <div className="py-20">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("coaching.title")}
        subtitle={t("coaching.subtitle")}
        icon={Users}
        actionButton={{
          label: t("coaching.inviteCoach"),
          icon: UserPlus,
          onClick: handleInviteCoach,
        }}
      />

      <CoachingTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCount={activeCoaches.length}
        pendingCount={pendingRequests.length}
        invitesCount={pendingInvites.length}
      />

      {activeTab === "active" && (
        <CoachList
          coaches={activeCoaches}
          emptyEmoji="👨‍🏫"
          emptyTitle={t("coaching.noActiveCoaches")}
          emptyDescription={t("coaching.noActiveCoachesDesc")}
          isActive
          onRemove={handleRemove}
        />
      )}

      {activeTab === "pending" && (
        <CoachList
          coaches={pendingRequests}
          emptyEmoji="📬"
          emptyTitle={t("coaching.noPendingRequests")}
          emptyDescription={t("coaching.noPendingRequestsDesc")}
          isPending
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}

      {activeTab === "invites" && (
        <CoachList
          coaches={pendingInvites}
          emptyEmoji="📨"
          emptyTitle={t("coaching.noSentInvites")}
          emptyDescription={t("coaching.noSentInvitesDesc")}
          isPending
          isActive
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}

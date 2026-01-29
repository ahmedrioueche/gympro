import { type ProgramDayProgress } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import {
  useActiveProgram,
  useDeleteSession,
} from "../../../../../hooks/queries/useTraining";
import { useModalStore } from "../../../../../store/modal";
import PageHeader from "../../../../components/PageHeader";
import { ActiveProgramCard } from "./components/active-program-card/ActiveProgramCard";
import { SessionList } from "./components/session-list/SessionList";

export default function TrainingPage() {
  const { t } = useTranslation();
  const { data: activeHistory, isLoading: isActiveLoading } =
    useActiveProgram();
  const deleteSession = useDeleteSession();
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  // Recent sessions from active program
  const activeSessions = activeHistory?.progress.dayLogs
    ? [...activeHistory.progress.dayLogs].reverse()
    : [];

  const handleEditSession = (session: ProgramDayProgress) => {
    if (!activeHistory) return;
    openModal("log_session", {
      activeHistory,
      initialSession: session,
      mode: "edit",
    });
  };

  const handleLogNewSession = () => {
    if (!activeHistory) return;
    openModal("log_session", {
      activeHistory,
      mode: "new",
    });
  };

  const handleDeleteSession = (session: ProgramDayProgress) => {
    if (!activeHistory) return;

    openModal("confirm", {
      title: t("training.logSession.deleteTitle"), // "Delete Session"
      text: t("training.logSession.deleteMessage"), // "Are you sure you want to delete this session?"
      confirmText: t("common.delete"),
      confirmVariant: "danger",
      verificationText: t("training.logSession.deleteVerificationText"), // e.g "DELETE"
      onConfirm: async () => {
        console.log("Full session object:", session);
        const sessionId = (session as any)._id || (session as any).id;
        const submissionId = (session as any).submissionId;
        const idToDelete = sessionId || submissionId;
        console.log(idToDelete);
        if (!idToDelete) return;

        await deleteSession.mutateAsync({
          programId: activeHistory.program._id!,
          sessionId: idToDelete,
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("training.page.title")}
        subtitle={t("training.page.subtitle")}
        icon={Dumbbell}
        actionButton={
          activeHistory
            ? {
                label: t("training.page.yourProgress"),
                icon: TrendingUp,
                onClick: () => {
                  navigate({ to: APP_PAGES.member.progress.link });
                },
                show: true,
              }
            : undefined
        }
      />

      {/* Active Program Section - Always render to prevent flickering */}
      <div className="space-y-6">
        {isActiveLoading ? (
          <div className="h-48 bg-surface border border-border rounded-2xl animate-pulse" />
        ) : (
          <ActiveProgramCard
            history={activeHistory}
            onLogSession={handleLogNewSession}
          />
        )}
      </div>

      {/* Recent Sessions Section */}
      {!isActiveLoading && activeSessions.length > 0 && activeHistory && (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            {t("training.page.recentSessions")}
          </h3>
          <SessionList
            sessions={activeSessions.slice(0, 10)}
            program={activeHistory.program}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
          />
        </div>
      )}
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import { useActiveProgram } from "../../../../../hooks/queries/useTraining";
import PageHeader from "../../../../components/PageHeader";
import { ActiveProgramCard } from "./components/ActiveProgramCard";
import { LogSessionModal } from "./components/log-session-modal/LogSessionModal";
import { SessionList } from "./components/session-list/SessionList";

export default function TrainingPage() {
  const { t } = useTranslation();
  const { data: activeHistory, isLoading: isActiveLoading } =
    useActiveProgram();
  const [isLogSessionOpen, setIsLogSessionOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(undefined); // Using any temporarily or import type if preferred
  const navigate = useNavigate();

  // Recent sessions from active program
  const activeSessions = activeHistory?.progress.dayLogs || [];

  const handleEditSession = (session: any) => {
    setEditingSession(session);
    setIsLogSessionOpen(true);
  };

  const handleCloseModal = () => {
    setIsLogSessionOpen(false);
    setTimeout(() => setEditingSession(undefined), 300); // Clear after animation
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
            onLogSession={() => {
              setEditingSession(undefined);
              setIsLogSessionOpen(true);
            }}
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
          />
        </div>
      )}

      {/* Log Session Modal - Only when there's an active program */}
      {activeHistory && (
        <LogSessionModal
          isOpen={isLogSessionOpen}
          onClose={handleCloseModal}
          activeHistory={activeHistory}
          initialSession={editingSession}
        />
      )}
    </div>
  );
}

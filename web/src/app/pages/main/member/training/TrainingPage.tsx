import { Dumbbell, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useActiveProgram } from "../../../../../hooks/queries/useTraining";
import PageHeader from "../../../../components/PageHeader";
import { ActiveProgramHeader } from "./components/ActiveProgramHeader";
import { LogSessionModal } from "./components/LogSessionModal";
import { SessionList } from "./components/SessionList";

export default function TrainingPage() {
  const { t } = useTranslation();
  const { data: activeHistory, isLoading: isActiveLoading } =
    useActiveProgram();
  const [isLogSessionOpen, setIsLogSessionOpen] = useState(false);

  // Recent sessions from active program
  const activeSessions = activeHistory?.progress.dayLogs || [];

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title={t("training.page.title")}
          subtitle={t("training.page.subtitle")}
          icon={Dumbbell}
          actionButton={
            activeHistory
              ? {
                  label: t("training.activeProgram.logWorkout"),
                  icon: Plus,
                  onClick: () => setIsLogSessionOpen(true),
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
            <ActiveProgramHeader
              history={activeHistory}
              onLogSession={() => setIsLogSessionOpen(true)}
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
            />
          </div>
        )}

        {/* Log Session Modal - Only when there's an active program */}
        {activeHistory && (
          <LogSessionModal
            isOpen={isLogSessionOpen}
            onClose={() => setIsLogSessionOpen(false)}
            activeHistory={activeHistory}
          />
        )}
      </div>
    </div>
  );
}

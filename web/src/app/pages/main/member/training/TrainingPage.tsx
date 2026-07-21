import { type ProgramDayProgress } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Dumbbell, History, TrendingUp } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../components/ui/NoData";
import Tab from "../../../../../components/ui/Tab";
import { APP_PAGES } from "../../../../../constants/navigation";
import {
  useActiveProgram,
  useDeleteSession,
  useResumeHistory,
  useStartProgram,
  useTrainingHistory,
} from "../../../../../hooks/queries/useTraining";
import { useModalStore } from "../../../../../store/modal";
import PageHeader from "../../../../components/PageHeader";
import { ActiveProgramCard } from "./components/active-program-card/ActiveProgramCard";
import {
  clearSessionDraft,
  findResumableSession,
} from "./components/log-session-modal/sessionDraftUtils";
import { useBackgroundSessionTimerSync } from "./components/log-session-modal/useBackgroundSessionTimerSync";
import { ProgramHistoryList } from "./components/ProgramHistoryList";
import { SessionList } from "./components/session-list/SessionList";

type TabType = "current" | "history";

export default function TrainingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("current");

  const { data: activeHistory, isLoading: isActiveLoading } =
    useActiveProgram();
  const { data: fullHistory, isLoading: isHistoryLoading } =
    useTrainingHistory();
  const deleteSession = useDeleteSession();
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  // Recent sessions from active program
  const activeSessions = activeHistory?.progress.dayLogs
    ? [...activeHistory.progress.dayLogs].reverse()
    : [];

  const startProgram = useStartProgram();
  const resumeHistory = useResumeHistory();

  const handleRestartProgram = (historyId: string) => {
    if (activeHistory) {
      toast.error(t("training.page.start.activeCheck"));
      return;
    }

    resumeHistory.mutate(historyId, {
      onSuccess: () => {
        setActiveTab("current");
      },
    });
  };

  // Filter history for the history tab (exclude current active/paused program)
  const pastPrograms =
    fullHistory?.filter((h) => h._id !== activeHistory?._id) || [];

  useBackgroundSessionTimerSync(
    activeHistory?.program._id,
    activeHistory?.progress.dayLogs,
  );

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

    const programId = activeHistory.program._id!;
    const resumable = findResumableSession(
      programId,
      activeHistory.progress.dayLogs,
    );

    if (!resumable) {
      openModal("log_session", {
        activeHistory,
        mode: "new",
      });
      return;
    }

    const timeAgo = formatDistanceToNow(new Date(resumable.timestamp), {
      addSuffix: true,
    });

    openModal("confirm", {
      title: t("training.logSession.resumePrompt.title"),
      text: t("training.logSession.resumePrompt.message", {
        dayName: resumable.dayName,
        timeAgo,
      }),
      confirmText: t("training.logSession.resumePrompt.startNew"),
      confirmVariant: "primary",
      secondaryAction: {
        label: t("training.logSession.resumePrompt.resume"),
        variant: "primary",
        onClick: () => {
          openModal("log_session", {
            activeHistory,
            mode: "new",
            initialDayName: resumable.dayName,
            ...(resumable.session ? { initialSession: resumable.session } : {}),
          });
        },
      },
      onConfirm: () => {
        clearSessionDraft(programId, resumable.dayName);
        openModal("log_session", {
          activeHistory,
          mode: "new",
          forceNew: true,
          initialDayName: resumable.dayName,
        });
      },
    });
  };

  const handleDeleteSession = (session: ProgramDayProgress) => {
    if (!activeHistory) return;

    openModal("confirm", {
      title: t("training.logSession.deleteTitle"),
      text: t("training.logSession.deleteMessage"),
      confirmText: t("common.delete"),
      confirmVariant: "danger",
      verificationText: t("training.logSession.deleteVerificationText"),
      onConfirm: async () => {
        const sessionId = (session as any)._id || (session as any).id;
        const submissionId = (session as any).submissionId;
        const idToDelete = sessionId || submissionId;
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

      {/* Standard Tab Switcher */}
      <div className="flex items-center gap-8 border-b border-border mb-6">
        <Tab
          label={t("training.page.tabs.current")}
          isActive={activeTab === "current"}
          onClick={() => setActiveTab("current")}
        />
        <Tab
          label={t("training.page.tabs.history")}
          isActive={activeTab === "history"}
          count={pastPrograms.length > 0 ? pastPrograms.length : undefined}
          onClick={() => setActiveTab("history")}
        />
      </div>

      {activeTab === "current" ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Active Program Section */}
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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
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
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {isHistoryLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-surface border border-border rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : pastPrograms.length > 0 ? (
            <ProgramHistoryList
              history={pastPrograms}
              onRestart={handleRestartProgram}
              isRestarting={startProgram.isPending}
            />
          ) : (
            <NoData
              icon={History}
              title={t("training.history.empty")}
              description={t("training.history.emptyDesc")}
            />
          )}
        </div>
      )}
    </div>
  );
}

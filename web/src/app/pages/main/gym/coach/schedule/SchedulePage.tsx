import type { Session } from "@ahmedrioueche/gympro-client";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { useCoachSessions } from "../../../../../../hooks/queries/useSessions";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import { CalendarHeader } from "../../../../../components/schedule/CalendarHeader";
import { WeeklyGrid } from "../../../../../components/schedule/WeeklyGrid";
import { useGymCoachClients } from "../clients/hooks/useGymCoachClients";
import { useSchedule } from "./hooks/useSchedule";

export default function SchedulePage() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { data: clients } = useGymCoachClients();

  const {
    weekDays,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
    getSessionsForDay,
    formatDateHeader,
    weekStart,
    weekEnd,
  } = useSchedule();

  const {
    data: sessionsData,
    isLoading: isLoadingSessions,
    isError: isErrorSessions,
  } = useCoachSessions({
    startDate: weekStart.toISOString(),
    endDate: weekEnd.toISOString(),
  });

  // sessionsData is ApiResponse<Session[]>, so extract the actual array from data.data
  // Filter sessions to only show those for clients in the current gym
  const clientIds = new Set(clients?.map((c) => c.userId) || []);
  const allSessions = sessionsData?.data || [];
  const sessions = allSessions.filter((session) =>
    clientIds.has(session.memberId),
  );

  const hasSessions = sessions.length > 0;

  const handleSessionClick = (session: Session) => {
    openModal("session_details", { session });
  };

  const handleCreateSession = () => {
    openModal("create_session");
  };

  if (isErrorSessions) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("schedule.title")}
          subtitle={t("schedule.subtitle")}
          icon={Calendar}
        />
        <NoData
          emoji="⚠️"
          title={t("common.error")}
          description={t("schedule.fetchError")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("schedule.title")}
        subtitle={t("schedule.subtitle")}
        icon={Calendar}
        actionButton={
          hasSessions
            ? {
                label: t("schedule.createSession"),
                icon: Calendar,
                onClick: handleCreateSession,
              }
            : undefined
        }
      />

      <CalendarHeader
        dateHeader={formatDateHeader()}
        onPrevWeek={goToPrevWeek}
        onNextWeek={goToNextWeek}
        onToday={goToToday}
      />

      {isLoadingSessions ? (
        <Loading className="py-20" />
      ) : !hasSessions ? (
        <NoData
          emoji="📅"
          title={t("schedule.noSessions")}
          description={t("schedule.noSessionsDesc")}
          actionButton={{
            label: t("schedule.createSession"),
            icon: Calendar,
            onClick: handleCreateSession,
          }}
        />
      ) : (
        <WeeklyGrid
          weekDays={weekDays}
          sessions={sessions}
          getSessionsForDay={getSessionsForDay}
          onSessionClick={handleSessionClick}
        />
      )}
    </div>
  );
}

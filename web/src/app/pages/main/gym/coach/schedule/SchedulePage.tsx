import type { GymClass, Session } from "@ahmedrioueche/gympro-client";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { useCoachClasses } from "../../../../../../hooks/queries/useGymClasses";
import { useCoachSessions } from "../../../../../../hooks/queries/useSessions";
import { useModalStore } from "../../../../../../store/modal";
import { useUserStore } from "../../../../../../store/user";
import PageHeader from "../../../../../components/PageHeader";
import { CalendarHeader } from "../../../../../components/schedule/CalendarHeader";
import { WeeklyGrid } from "../../../../../components/schedule/WeeklyGrid";
import { useGymCoachClients } from "../clients/hooks/useGymCoachClients";
import { useSchedule } from "./hooks/useSchedule";

export default function SchedulePage() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { user } = useUserStore();
  const { data: clients } = useGymCoachClients();

  const {
    weekDays,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
    getItemsForDay,
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

  // Fetch all gym classes (we filter by coach below)
  // Fetch all gym classes for this coach
  const {
    data: classesData,
    isLoading: isLoadingClasses,
    isError: isErrorClasses,
  } = useCoachClasses();

  // sessionsData is ApiResponse<Session[]>, so extract the actual array from data.data
  // Filter sessions to only show those for clients in the current gym
  const clientIds = new Set(clients?.map((c) => c.userId) || []);
  const allSessions = sessionsData?.data || [];
  const sessions = allSessions.filter((session) =>
    clientIds.has(session.memberId),
  );

  const coachClasses = classesData?.data || [];

  const hasItems = sessions.length > 0 || coachClasses.length > 0;

  const handleSessionClick = (session: Session) => {
    openModal("session_details", { session });
  };

  const handleClassClick = (gymClass: GymClass) => {
    // Possibly open a class details modal or navigate
    console.log("Class clicked", gymClass);
  };

  const handleCreateSession = () => {
    openModal("create_session");
  };

  if (isErrorSessions || isErrorClasses) {
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
          hasItems
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

      {isLoadingSessions || isLoadingClasses ? (
        <Loading className="py-20" />
      ) : !hasItems ? (
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
          gymClasses={coachClasses}
          getItemsForDay={getItemsForDay}
          onSessionClick={handleSessionClick}
          onClassClick={handleClassClick}
        />
      )}
    </div>
  );
}

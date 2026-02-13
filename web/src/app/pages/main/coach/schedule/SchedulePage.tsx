import type { GymClass, Session } from "@ahmedrioueche/gympro-client";
import { Calendar as CalendarIcon, List, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import {
  useCoachClasses,
  useDeleteClass,
} from "../../../../../hooks/queries/useGymClasses";
import { useCoachSessions } from "../../../../../hooks/queries/useSessions";
import { useGymStore } from "../../../../../store/gym";
import { useModalStore } from "../../../../../store/modal";
import { useUserStore } from "../../../../../store/user";
import ClassCard from "../../../../components/cards/ClassCard";
import PageHeader from "../../../../components/PageHeader";
import { CalendarHeader } from "../../../../components/schedule/CalendarHeader";
import { SessionCard } from "../../../../components/schedule/SessionCard";
import { WeeklyGrid } from "../../../../components/schedule/WeeklyGrid";
import { useSchedule } from "./hooks/useSchedule";

export default function SchedulePage() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { currentGym } = useGymStore();
  const { user } = useUserStore();
  const [view, setView] = useState<"calendar" | "list">("calendar");

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

  const {
    data: classesData,
    isLoading: isLoadingClasses,
    isError: isErrorClasses,
  } = useCoachClasses();

  const sessions = sessionsData?.data || [];
  const coachClasses = classesData?.data || [];

  const { mutate: deleteClass } = useDeleteClass();

  const handleSessionClick = (session: Session) => {
    openModal("session_details", { session });
  };

  const handleDeleteClass = (gymClass: GymClass) => {
    if (gymClass.seriesId) {
      openModal("confirm", {
        title: t("classes.delete.title", "Delete Class"),
        text: t(
          "classes.delete.message",
          "This is a recurring class. Would you like to cancel only this specific session or the entire series?",
        ),
        onConfirm: () => {
          deleteClass({ id: gymClass._id, deleteSeries: false });
        },
        confirmVariant: "danger",
        confirmText: t("classes.delete.confirmOne", "Cancel only this session"),
        secondaryAction: {
          label: t("classes.delete.confirmSeries", "Cancel entire series"),
          onClick: () => {
            deleteClass({ id: gymClass._id, deleteSeries: true });
          },
        },
      });
    } else {
      openModal("confirm", {
        title: t("classes.delete.title", "Delete Class"),
        text: t(
          "classes.confirmDeleteDesc",
          "Are you sure you want to delete this class? This action cannot be undone.",
        ),
        onConfirm: () => {
          deleteClass({ id: gymClass._id });
        },
        confirmVariant: "danger",
        confirmText: t("common.delete", "Delete"),
      });
    }
  };

  const handleClassClick = (gymClass: GymClass) => {
    openModal("class_details", {
      gymClass,
      onCancelClass: () => handleDeleteClass(gymClass),
    });
  };

  const handleCreateSession = () => {
    openModal("create_session", { gymId: currentGym?._id });
  };

  const handleCreateClass = () => {
    openModal("gym_class", { gymId: currentGym?._id });
  };

  if (isErrorSessions || isErrorClasses) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("schedule.title")}
          subtitle={t("schedule.subtitle")}
          icon={CalendarIcon}
        />
        <NoData
          emoji="⚠️"
          title={t("common.error")}
          description={t("schedule.fetchError")}
        />
      </div>
    );
  }

  // Group recurring classes for list view
  const now = new Date();
  const groupedClasses = coachClasses.reduce(
    (acc: GymClass[], curr: GymClass) => {
      if (!curr.seriesId) {
        acc.push(curr);
      } else {
        const existingIndex = acc.findIndex(
          (c) => c.seriesId === curr.seriesId,
        );
        if (existingIndex === -1) {
          acc.push(curr);
        } else {
          const existingDate = new Date(acc[existingIndex].scheduledAt);
          const currDate = new Date(curr.scheduledAt);
          if (
            currDate >= now &&
            (existingDate < now || currDate < existingDate)
          ) {
            acc[existingIndex] = curr;
          }
        }
      }
      return acc;
    },
    [],
  );

  const hasItems = sessions.length > 0 || coachClasses.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("schedule.title")}
        subtitle={t("schedule.subtitle")}
        icon={CalendarIcon}
        actions={[
          {
            label:
              view === "calendar" ? t("common.list") : t("common.calendar"),
            icon: view === "calendar" ? List : CalendarIcon,
            onClick: () => setView(view === "calendar" ? "list" : "calendar"),
          },
          {
            label: t("schedule.createSession"),
            icon: Plus,
            onClick: handleCreateSession,
          },
          {
            label: t("schedule.createClass"),
            icon: Plus,
            onClick: handleCreateClass,
          },
        ]}
      />

      {view === "calendar" && (
        <CalendarHeader
          dateHeader={formatDateHeader()}
          onPrevWeek={goToPrevWeek}
          onNextWeek={goToNextWeek}
          onToday={goToToday}
        />
      )}

      {isLoadingSessions || isLoadingClasses ? (
        <Loading className="py-20" />
      ) : !hasItems ? (
        <NoData
          emoji="📅"
          title={t("schedule.noSessions")}
          description={t("schedule.noSessionsDesc")}
          actionButton={{
            label: t("schedule.createSession"),
            icon: Plus,
            onClick: handleCreateSession,
          }}
        />
      ) : view === "calendar" ? (
        <WeeklyGrid
          weekDays={weekDays}
          sessions={sessions}
          gymClasses={coachClasses}
          getItemsForDay={getItemsForDay}
          onSessionClick={handleSessionClick}
          onClassClick={handleClassClick}
        />
      ) : (
        <div className="space-y-10">
          {groupedClasses.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
                <h2 className="text-xl font-bold text-white">
                  {t("pages.gym.classes")}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-xs font-medium">
                  {groupedClasses.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedClasses.map((gymClass) => (
                  <ClassCard
                    key={gymClass._id}
                    gymClass={gymClass}
                    onEdit={(c) =>
                      openModal("gym_class", {
                        gymId: currentGym?._id,
                        gymClass: c,
                      })
                    }
                    onDelete={handleDeleteClass}
                  />
                ))}
              </div>
            </div>
          )}

          {sessions.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500" />
                <h2 className="text-xl font-bold text-white">
                  {t("schedule.sessions")}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-xs font-medium">
                  {sessions.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                  <SessionCard
                    key={session._id}
                    session={session}
                    onClick={() => handleSessionClick(session)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

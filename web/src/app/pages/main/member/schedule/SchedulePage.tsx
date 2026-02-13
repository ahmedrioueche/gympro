import { Calendar as CalendarIcon, List } from "lucide-react";
import Loading from "../../../../../components/ui/Loading";
import PageHeader from "../../../../components/PageHeader";
import { CalendarHeader } from "../../../../components/schedule/CalendarHeader";
import { WeeklyGrid } from "../../../../components/schedule/WeeklyGrid";
import { ScheduleTimeline } from "./components/ScheduleTimeline";
import { TrainingProgramBanner } from "./components/TrainingProgramBanner";
import { useMemberSchedule } from "./hooks/useMemberSchedule";

export default function SchedulePage() {
  const {
    t,
    view,
    setView,
    scheduleUtils,
    sessions,
    memberClasses,
    activeProgram,
    isLoading,
    groupedItems,
    handleSessionClick,
    handleClassClick,
  } = useMemberSchedule();

  const {
    weekDays,
    formatDateHeader,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
    getItemsForDay,
  } = scheduleUtils;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("schedule.title", "My Schedule")}
        subtitle={t("schedule.memberSubtitle")}
        icon={CalendarIcon}
        actions={[
          {
            label:
              view === "calendar" ? t("common.list") : t("common.calendar"),
            icon: view === "calendar" ? List : CalendarIcon,
            onClick: () => setView(view === "calendar" ? "list" : "calendar"),
          },
        ]}
      />

      <div className="flex flex-col gap-6">
        {view === "calendar" && (
          <CalendarHeader
            dateHeader={formatDateHeader()}
            onPrevWeek={goToPrevWeek}
            onNextWeek={goToNextWeek}
            onToday={goToToday}
          />
        )}

        {isLoading ? (
          <Loading className="py-20" />
        ) : (
          <>
            {view === "calendar" ? (
              <WeeklyGrid
                weekDays={weekDays}
                sessions={sessions}
                gymClasses={memberClasses}
                getItemsForDay={getItemsForDay}
                onSessionClick={handleSessionClick}
                onClassClick={handleClassClick}
              />
            ) : (
              <div className="space-y-10">
                <ScheduleTimeline
                  groupedItems={groupedItems}
                  handleClassClick={handleClassClick}
                  handleSessionClick={handleSessionClick}
                />

                <TrainingProgramBanner activeProgram={activeProgram} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

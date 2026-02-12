import { type GymClass } from "@ahmedrioueche/gympro-client";
import { Calendar as CalendarIcon, List, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import { CalendarHeader } from "../../../../../components/schedule/CalendarHeader";
import { WeeklyGrid } from "../../../../../components/schedule/WeeklyGrid";
import { useSchedule } from "../../coach/schedule/hooks/useSchedule";
import ClassCard from "./components/ClassCard";
import { useManagerClasses } from "./hooks/useManagerClasses";

export default function ClassesPage() {
  const { t } = useTranslation();
  const [view, setView] = useState<"list" | "calendar">("list");
  const {
    classes,
    allClasses,
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
  } = useManagerClasses();

  const {
    weekDays,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
    getItemsForDay,
    formatDateHeader,
  } = useSchedule();
  const { openModal } = useModalStore();

  const handleClassClick = (gymClass: GymClass) => {
    openModal("class_details", {
      gymClass,
      onCancelClass: (id: string, deleteSeries?: boolean) =>
        handleDelete(gymClass),
    });
  };

  if (isLoading)
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("pages.gym.classes", "Gym Classes")}
          subtitle={t(
            "classes.pageDesc",
            "Manage your group workouts and schedules",
          )}
        />
        <Loading />
      </div>
    );

  if (error) return <ErrorComponent />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pages.gym.classes", "Gym Classes")}
        subtitle={t(
          "classes.pageDesc",
          "Manage your group workouts and schedules",
        )}
        icon={CalendarIcon}
        actions={[
          {
            label: view === "list" ? t("common.calendar") : t("common.list"),
            icon: view === "list" ? CalendarIcon : List,
            onClick: () => setView(view === "list" ? "calendar" : "list"),
          },
          {
            label: t("classes.createBtn", "Create Class"),
            icon: Plus,
            onClick: handleCreate,
          },
        ]}
      />

      {view === "calendar" ? (
        <div className="space-y-6">
          <CalendarHeader
            dateHeader={formatDateHeader()}
            onPrevWeek={goToPrevWeek}
            onNextWeek={goToNextWeek}
            onToday={goToToday}
          />
          <WeeklyGrid
            weekDays={weekDays}
            sessions={[]}
            gymClasses={allClasses}
            getItemsForDay={getItemsForDay}
            onSessionClick={() => {}}
            onClassClick={handleClassClick}
          />
        </div>
      ) : classes.length === 0 ? (
        <NoData
          title={t("classes.noClasses", "No classes scheduled")}
          description={t(
            "classes.noClassesDesc",
            "Start by creating your first group workout session.",
          )}
          icon={CalendarIcon}
          actionButton={{
            label: t("classes.createBtn", "Create Class"),
            onClick: handleCreate,
            icon: Plus,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((gymClass) => (
            <ClassCard
              key={gymClass._id}
              gymClass={gymClass}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

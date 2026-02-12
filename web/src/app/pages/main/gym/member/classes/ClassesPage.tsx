import { Calendar as CalendarIcon, List } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import { CalendarHeader } from "../../../../../components/schedule/CalendarHeader";
import { WeeklyGrid } from "../../../../../components/schedule/WeeklyGrid";
import { useSchedule } from "../../coach/schedule/hooks/useSchedule";
import { MemberClassCard } from "./components/MemberClassCard";
import { useMemberClasses } from "./hooks/useMemberClasses";

export default function ClassesPage() {
  const { t } = useTranslation();
  const [view, setView] = useState<"list" | "calendar">("list");
  const {
    classes,
    allClasses,
    isLoading,
    isProcessing,
    hasClasses,
    user,
    handleBook,
    handleCancel,
  } = useMemberClasses();

  const {
    weekDays,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
    getItemsForDay,
    formatDateHeader,
  } = useSchedule();

  const { openModal } = useModalStore();

  const handleClassClick = (gymClass: any) => {
    openModal("class_details", {
      gymClass,
      onBook: handleBook,
      onCancel: handleCancel,
      isBooking: isProcessing,
    });
  };

  if (isLoading)
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("pages.gym.classes")}
          subtitle={t("classes.memberPageDesc")}
          icon={CalendarIcon}
        />
        <Loading />
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pages.gym.classes")}
        subtitle={t("classes.memberPageDesc")}
        icon={CalendarIcon}
        actions={[
          {
            label: view === "list" ? t("common.calendar") : t("common.list"),
            icon: view === "list" ? CalendarIcon : List,
            onClick: () => setView(view === "list" ? "calendar" : "list"),
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
      ) : !hasClasses ? (
        <NoData
          emoji="📅"
          title={t("classes.noClasses")}
          description={t("classes.noClassesDesc")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((gymClass) => {
            const isBooked = gymClass.bookings.some(
              (b: any) => b.userId === user?._id,
            );
            const isFull = gymClass.bookings.length >= gymClass.maxCapacity;

            return (
              <MemberClassCard
                key={gymClass._id}
                gymClass={gymClass}
                userId={user?._id}
                isBooked={isBooked}
                isFull={isFull}
                onBook={handleBook}
                onCancel={handleCancel}
                isLoading={isProcessing}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

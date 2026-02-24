import type { GymClass, Session } from "@ahmedrioueche/gympro-client";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../../components/ui/NoData";
import ClassCard from "../../../../../components/cards/ClassCard";
import { SessionCard } from "../../../../../components/schedule/SessionCard";

interface ScheduleTimelineProps {
  groupedItems: {
    date: Date;
    items: { date: Date; type: "class" | "session"; data: any }[];
  }[];
  handleClassClick: (gymClass: GymClass) => void;
  handleSessionClick: (session: Session) => void;
}

export const ScheduleTimeline = ({
  groupedItems,
  handleClassClick,
  handleSessionClick,
}: ScheduleTimelineProps) => {
  const { t } = useTranslation();

  if (groupedItems.length === 0) {
    return (
      <NoData
        title={t("schedule.empty")}
        description={t("schedule.emptyDesc")}
        icon={CalendarIcon}
      />
    );
  }

  return (
    <div className="space-y-6 md:space-y-12">
      {groupedItems.map((group) => (
        <div key={group.date.toISOString()} className="space-y-3 md:space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-primary/50" />
            <h2 className="text-base md:text-xl font-bold text-white">
              {format(group.date, "EEEE, MMMM d")}
            </h2>
            {isSameDay(group.date, new Date()) && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                {t("schedule.today", "Today")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {group.items.map((item) =>
              item.type === "class" ? (
                <ClassCard
                  key={item.data._id}
                  gymClass={item.data}
                  isBooked
                  onCancel={() => handleClassClick(item.data)}
                />
              ) : (
                <SessionCard
                  key={item.data._id}
                  session={item.data}
                  onClick={() => handleSessionClick(item.data)}
                />
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

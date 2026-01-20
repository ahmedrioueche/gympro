import { type ProgressHistory } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

interface ActivityCalendarProps {
  history?: ProgressHistory[];
}

export const ActivityCalendar = ({ history }: ActivityCalendarProps) => {
  const { t } = useTranslation();

  // Simple visualization: Last 14 days grid
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split("T")[0];
  });

  const getActivityLevel = (dateStr: string) => {
    if (!history) return 0;
    const dayData = history.find((a) => a.date === dateStr);
    if (!dayData) return 0;
    // Log scale for intensity
    return dayData.volumeKg > 5000
      ? 4
      : dayData.volumeKg > 2000
      ? 3
      : dayData.volumeKg > 1000
      ? 2
      : 1;
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-border";
      case 1:
        return "bg-primary/30";
      case 2:
        return "bg-primary/50";
      case 3:
        return "bg-primary/70";
      case 4:
        return "bg-primary";
      default:
        return "bg-border";
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6 h-full">
      <h3 className="font-bold text-text-primary mb-6">
        {t("progress.calendar.title")}
      </h3>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((dateStr) => {
          const date = new Date(dateStr);
          const level = getActivityLevel(dateStr);

          return (
            <div
              key={dateStr}
              className="flex-1 min-w-[30px] flex flex-col gap-2 items-center group relative"
            >
              <div
                className={`w-full aspect-[2/3] rounded-lg transition-all ${getLevelColor(
                  level
                )}`}
              />
              <span className="text-[10px] text-text-secondary font-medium">
                {date.getDate()}
              </span>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-surface text-text-primary text-xs px-2 py-1 rounded shadow-lg border border-border pointer-events-none z-10">
                {date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

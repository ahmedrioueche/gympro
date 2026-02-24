import { type ProgressHistory } from "@ahmedrioueche/gympro-client";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import useWeightUnit from "../../../../../../hooks/useWeightUnit";

interface ActivityCalendarProps {
  history?: ProgressHistory[];
}

export const ActivityCalendar = ({ history }: ActivityCalendarProps) => {
  const { t } = useTranslation();
  const { unit: weightUnit } = useWeightUnit();

  // Generate last 12 weeks of data (84 days)
  const daysToShow = 84;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: daysToShow }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (daysToShow - 1 - i));
    return d.toISOString().split("T")[0];
  });

  const getActivityLevel = (dateStr: string) => {
    if (!history) return 0;
    const dayData = history.find((a) => a.date === dateStr);
    if (!dayData) return 0;

    if (dayData.volumeKg >= 10000) return 4;
    if (dayData.volumeKg >= 5000) return 3;
    if (dayData.volumeKg >= 2000) return 2;
    return 1;
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-border/20";
      case 1:
        return "bg-primary/20 hover:bg-primary/30";
      case 2:
        return "bg-primary/40 hover:bg-primary/50";
      case 3:
        return "bg-primary/70 hover:bg-primary/80";
      case 4:
        return "bg-primary hover:brightness-110";
      default:
        return "bg-border/20";
    }
  };

  // Group into weeks
  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="bg-surface rounded-3xl border border-border/50 p-4 md:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-black text-text-primary tracking-tight">
            {t("progress.calendar.title", "Activity Heatmap")}
          </h3>
          <p className="text-[10px] md:text-xs text-text-secondary font-medium">
            {t("progress.calendar.subtitle", "Consistency is key to success")}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-surface-hover text-text-secondary">
          <Info size={16} />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto no-scrollbar -mx-1 px-1">
        <div className="min-w-[500px] md:min-w-0">
          <div className="grid grid-flow-col grid-rows-7 gap-1 md:gap-1.5 w-full">
            {days.map((dateStr) => {
              const date = new Date(dateStr);
              const level = getActivityLevel(dateStr);
              const isToday = dateStr === today.toISOString().split("T")[0];

              return (
                <div
                  key={dateStr}
                  className={`w-full aspect-square rounded-[3px] md:rounded-[4px] transition-all cursor-pointer relative group ${getLevelColor(
                    level,
                  )} ${
                    isToday
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-surface"
                      : ""
                  }`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-text-primary text-surface text-[10px] font-bold px-2 py-1 rounded shadow-xl pointer-events-none z-20">
                    <div className="flex flex-col items-center">
                      <span>
                        {date.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {level > 0 && (
                        <span className="text-primary-light">
                          {history?.find((h) => h.date === dateStr)?.volumeKg}{" "}
                          {weightUnit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-6 flex items-center justify-between text-[9px] md:text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest">
        <span>
          {new Date(days[0]).toLocaleDateString(undefined, { month: "short" })}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline">
            {t("progress.calendar.less")}
          </span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((l) => (
              <div
                key={l}
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-[2px] ${getLevelColor(
                  l,
                )}`}
              />
            ))}
          </div>
          <span className="hidden sm:inline">
            {t("progress.calendar.more")}
          </span>
        </div>
        <span>{t("progress.calendar.today")}</span>
      </div>
    </div>
  );
};

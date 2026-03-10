import { Calendar, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummySchedule = () => {
  const { t } = useTranslation();

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.schedule.pageTitle")}
      locationKey="schedule"
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="text-sm font-black text-text-secondary uppercase tracking-widest">
              {t("welcomeTour.dummies.schedule.agenda")}
            </h4>
            <span className="text-xs font-bold text-primary italic">
              {t("welcomeTour.dummies.schedule.date")}
            </span>
          </div>

          {[
            {
              time: "08:00",
              title: t("welcomeTour.dummies.schedule.weightlifting"),
              instructor: t("welcomeTour.dummies.schedule.mark"),
              status: "booked",
            },
            {
              time: "10:30",
              title: t("welcomeTour.dummies.schedule.yoga"),
              instructor: t("welcomeTour.dummies.schedule.sarah"),
              status: "available",
            },
            {
              time: t("welcomeTour.dummies.schedule.time"),
              title: t("welcomeTour.dummies.schedule.class"),
              instructor: t("welcomeTour.dummies.schedule.instructor"),
              status: "booked",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`bg-surface border rounded-3xl p-4 flex items-center gap-4 transition-all hover:scale-[1.01] ${
                item.status === "booked"
                  ? "border-primary/30 shadow-lg shadow-primary/5"
                  : "border-border/40 opacity-60"
              }`}
            >
              <div className="text-center min-w-[60px] border-r border-border/40 pr-4">
                <span className="text-lg font-black text-text-primary block leading-none">
                  {item.time}
                </span>
                <span className="text-[8px] font-bold text-text-secondary uppercase">
                  {t("welcomeTour.dummies.schedule.amPm")}
                </span>
              </div>

              <div className="flex-1">
                <h5 className="font-black text-text-primary text-base leading-tight">
                  {item.title}
                </h5>
                <div className="flex items-center gap-2 mt-1 text-text-secondary">
                  <Users className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-bold">
                    {item.instructor}
                  </span>
                </div>
              </div>

              {item.status === "booked" ? (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[8px] font-black uppercase tracking-wider border border-primary/20">
                  {t("welcomeTour.dummies.schedule.booked")}
                </span>
              ) : (
                <button className="px-3 py-1 bg-background-secondary text-text-secondary rounded-full text-[8px] font-black uppercase tracking-wider border border-border">
                  {t("welcomeTour.dummies.schedule.bookNow")}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border/40 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-2">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h5 className="font-black text-text-primary uppercase tracking-widest text-sm">
            {t("welcomeTour.dummies.schedule.fullCalendar")}
          </h5>
          <p className="text-xs text-text-secondary font-medium">
            {t("welcomeTour.dummies.schedule.calendarDesc")}
          </p>
          <button className="w-full py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/30">
            {t("welcomeTour.dummies.schedule.openPlanner")}
          </button>
        </div>
      </div>
    </DummyPageWrapper>
  );
};

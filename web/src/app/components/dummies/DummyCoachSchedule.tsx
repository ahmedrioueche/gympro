import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyCoachSchedule = () => {
  const { t } = useTranslation();
  const { isRtl } = useLanguageStore();

  const sessions = [
    {
      name: "Advanced Crossfit",
      time: "09:00 - 10:30",
      location: "Main Hall",
      booked: "18/20",
      type: "Group",
    },
    {
      name: "Personal Training",
      time: "11:00 - 12:00",
      location: "Studio A",
      booked: "1/1",
      type: "1-on-1",
    },
    {
      name: "Yoga Flow",
      time: "16:00 - 17:00",
      location: "Zen Garden",
      booked: "12/15",
      type: "Group",
    },
  ];

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.coachSchedule.pageTitle")}
      locationKey="coachSchedule"
    >
      <div className="w-full max-w-4xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.coachSchedule.todaySessions")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic leading-none mt-1">
                6 {t("welcomeTour.dummies.coachSchedule.classes")}
              </h5>
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.coachSchedule.totalClients")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic leading-none mt-1">
                42 {t("welcomeTour.dummies.coachSchedule.active")}
              </h5>
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.coachSchedule.nextClass")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic leading-none mt-1">
                {t("common.in")} 45 {t("welcomeTour.dummies.coachSchedule.min")}
              </h5>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-black text-text-secondary uppercase tracking-widest">
              {t("welcomeTour.dummies.coachSchedule.title")}
            </h4>
            <div className="text-[10px] font-black uppercase tracking-widest text-primary cursor-pointer hover:underline">
              {t("welcomeTour.dummies.coachSchedule.fullCalendar")}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {sessions.map((session, i) => (
              <div
                key={i}
                className="bg-surface border border-border/40 rounded-2xl p-3 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 hover:border-primary/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-xl bg-background-secondary flex flex-col items-center justify-center border border-border/20 shadow-sm group-hover:bg-primary/5 transition-all">
                    <Calendar className="w-5 h-5 text-text-secondary opacity-40 group-hover:text-primary group-hover:opacity-100 transition-all" />
                  </div>
                  <div>
                    <h5 className="text-base font-black text-text-primary italic group-hover:text-primary transition-all">
                      {session.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1 text-text-secondary opacity-60">
                        <Clock className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          {session.time}
                        </span>
                      </div>
                      <span className="w-1 h-1 bg-text-secondary/20 rounded-full" />
                      <div className="flex items-center gap-1 text-text-secondary opacity-60">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          {session.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="flex-1 md:flex-none flex items-center gap-4">
                    <div className="text-end">
                      <p className="text-[8px] font-black uppercase tracking-widest text-text-secondary opacity-40 mb-0">
                        {t("welcomeTour.dummies.coachSchedule.type")}
                      </p>
                      <p className="text-[10px] font-black text-text-primary italic whitespace-nowrap">
                        {session.type}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="text-[8px] font-black uppercase tracking-widest text-text-secondary opacity-40 mb-0">
                        {t("welcomeTour.dummies.coachSchedule.attendance")}
                      </p>
                      <p className="text-[10px] font-black text-success italic whitespace-nowrap">
                        {session.booked}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center text-text-secondary group-hover:scale-110 transition-all shadow-sm">
                    {isRtl ? (
                      <ChevronLeft className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DummyPageWrapper>
  );
};

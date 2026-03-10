import {
  BarChart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language";
import { DummyPageWrapper } from "./DummyPageWrapper";

interface DummyManagerClassesProps {
  title?: string;
  locationKey?: string;
}

export const DummyManagerClasses: React.FC<DummyManagerClassesProps> = ({
  title,
  locationKey = "managerClasses",
}) => {
  const { t } = useTranslation();
  const { isRtl } = useLanguageStore();

  const classes = [
    {
      name: "Crossfit Blast",
      time: "18:00",
      coach: "Sarah J.",
      attendance: "95%",
      capacity: "20/20",
    },
    {
      name: "Yoga Flow",
      time: "10:30",
      coach: "Emma W.",
      attendance: "80%",
      capacity: "12/15",
    },
    {
      name: "Powerlifting",
      time: "19:30",
      coach: "Marcus C.",
      attendance: "100%",
      capacity: "10/10",
    },
  ];

  return (
    <DummyPageWrapper
      pageTitle={title || t("welcomeTour.dummies.managerClasses.pageTitle")}
      locationKey={locationKey}
    >
      <div className="w-full max-w-4xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-1 text-primary">
              <BarChart className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.managerClasses.attendance")}
              </span>
            </div>
            <div className="text-lg font-black text-text-primary italic">
              92% {t("welcomeTour.dummies.managerClasses.average")}
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-1 text-orange-500">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.managerClasses.popular")}
              </span>
            </div>
            <div className="text-lg font-black text-text-primary italic">
              Crossfit Blast
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-1 text-blue-500">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.managerClasses.upcoming")}
              </span>
            </div>
            <div className="text-lg font-black text-text-primary italic">
              8 {t("welcomeTour.dummies.managerClasses.left")}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-black text-text-secondary uppercase tracking-widest">
            {t("welcomeTour.dummies.managerClasses.title")}
          </h4>
          <button className="px-4 py-2 bg-background-secondary border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface transition-all">
            {t("welcomeTour.dummies.managerClasses.manage")}
          </button>
        </div>

        <div className="space-y-3">
          {classes.map((cls, i) => (
            <div
              key={i}
              className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3 group hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex flex-col items-center justify-center text-primary border border-primary/20 shadow-sm transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-black text-text-primary group-hover:text-primary transition-colors">
                    {cls.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      {cls.time}
                    </span>
                    <span className="w-1 h-1 bg-text-secondary/30 rounded-full" />
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      {cls.coach}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:block text-end">
                  <div className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                    {t("welcomeTour.dummies.managerClasses.capacity")}
                  </div>
                  <div className="text-xs font-black italic text-text-primary">
                    {cls.capacity}
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-background-secondary rounded-xl flex items-center gap-2 border border-border/20 shadow-sm transition-all group-hover:bg-primary/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">
                    {cls.attendance}
                  </span>
                  <div className="w-1 h-1 bg-text-secondary/30 rounded-full" />
                  {isRtl ? (
                    <ChevronLeft className="w-3.5 h-3.5 text-text-secondary opacity-40 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-all" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DummyPageWrapper>
  );
};

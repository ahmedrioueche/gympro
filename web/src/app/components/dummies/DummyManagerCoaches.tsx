import {
  Award,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyManagerCoaches = () => {
  const { t } = useTranslation();
  const { isRtl } = useLanguageStore();

  const coaches = [
    {
      name: "Marcus Chen",
      rating: "4.9",
      clients: "24",
      exp: "8y",
      specialty: "Hypertrophy",
    },
    {
      name: "Sarah Jenkins",
      rating: "4.8",
      clients: "18",
      exp: "5y",
      specialty: "Yoga Flow",
    },
    {
      name: "John Smith",
      rating: "4.7",
      clients: "15",
      exp: "12y",
      specialty: "Powerlifting",
    },
  ];

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.managerCoaches.pageTitle")}
      locationKey="managerCoaches"
    >
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-black text-text-secondary uppercase tracking-widest">
            {t("welcomeTour.dummies.managerCoaches.title")}
          </h4>
          <div className="flex items-center gap-2 text-primary font-bold text-xs cursor-pointer">
            <Search className="w-4 h-4" />{" "}
            {t("welcomeTour.dummies.managerCoaches.filter")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-1 text-yellow-500">
              <Star className="w-3.5 h-3.5 fill-yellow-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary opcity-60">
                {t("welcomeTour.dummies.managerCoaches.performance")}
              </span>
            </div>
            <div className="text-lg font-black text-text-primary italic">
              4.85 {t("welcomeTour.dummies.managerCoaches.avg")}
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-1 text-primary">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.managerCoaches.assignments")}
              </span>
            </div>
            <div className="text-lg font-black text-text-primary italic">
              57 {t("welcomeTour.dummies.managerCoaches.active")}
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-1 text-blue-500">
              <Award className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.managerCoaches.experience")}
              </span>
            </div>
            <div className="text-lg font-black text-text-primary italic">
              12y+ {t("welcomeTour.dummies.managerCoaches.elite")}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {coaches.map((coach, i) => (
            <div
              key={i}
              className="bg-surface border border-border/50 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-lg font-black text-white shadow-lg">
                  {coach.name.charAt(0)}
                </div>
                <div>
                  <h5 className="text-base font-black text-text-primary leading-tight flex items-center gap-2">
                    {coach.name}
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-lg text-[8px] font-black uppercase tracking-widest border border-primary/20">
                      {coach.specialty}
                    </span>
                  </h5>
                  <div className="flex items-center gap-2 mt-1 overflow-hidden">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3 h-3 fill-yellow-500" />
                      <span className="text-[10px] font-black italic">
                        {coach.rating}
                      </span>
                    </div>
                    <span className="w-1 h-1 bg-text-secondary/30 rounded-full" />
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      {coach.clients}{" "}
                      {t("welcomeTour.dummies.managerCoaches.clients")}
                    </span>
                    <span className="w-1 h-1 bg-text-secondary/30 rounded-full" />
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      {coach.exp} {t("welcomeTour.dummies.managerCoaches.exp")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex-1 md:flex-none h-1 w-full md:w-24 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                </div>
                {isRtl ? (
                  <ChevronLeft className="w-5 h-5 text-text-secondary opacity-40 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-text-secondary opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DummyPageWrapper>
  );
};

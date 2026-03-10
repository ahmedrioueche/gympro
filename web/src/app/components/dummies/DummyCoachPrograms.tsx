import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyCoachPrograms = () => {
  const { t } = useTranslation();
  const { isRtl } = useLanguageStore();

  const programs = [
    {
      name: "Hypertrophy Max",
      assigned: 12,
      rating: "4.9",
      level: "Advanced",
      type: "Muscle Gain",
    },
    {
      name: "Fat Loss Blitz",
      assigned: 8,
      rating: "4.8",
      level: "Beginner",
      type: "Weight Loss",
    },
    {
      name: "Strength Foundation",
      assigned: 6,
      rating: "4.7",
      level: "Intermediate",
      type: "Power",
    },
  ];

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.coachPrograms.pageTitle")}
      locationKey="coachPrograms"
    >
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-text-secondary uppercase tracking-widest">
            {t("welcomeTour.dummies.coachPrograms.title")}
          </h4>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <Plus className="w-3.5 h-3.5" />{" "}
            {t("welcomeTour.dummies.coachPrograms.newPlan")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.coachPrograms.created")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic leading-none mt-1">
                18 Plans
              </h5>
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.coachPrograms.assigned")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic leading-none mt-1">
                26 Active
              </h5>
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.coachPrograms.active")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic leading-none mt-1">
                94% Comp.
              </h5>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((program, i) => (
            <div
              key={i}
              className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-primary/20 transition-all pointer-events-none" />
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center text-primary border border-primary/20">
                  <Star className="w-5 h-5" />
                </div>
                <div className="px-2 py-0.5 bg-surface border border-border rounded-full text-[8px] font-black uppercase tracking-wider text-text-secondary">
                  {program.level}
                </div>
              </div>
              <h5 className="text-lg font-black text-text-primary mb-1 italic tracking-tight">
                {program.name}
              </h5>
              <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest mb-4 opacity-60">
                {program.type}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-border/10">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-[8px] font-black uppercase tracking-widest text-text-secondary opacity-50 mb-0">
                      Users
                    </div>
                    <div className="text-xs font-black text-text-primary italic">
                      {program.assigned}
                    </div>
                  </div>
                  <div className="w-px h-5 bg-border/20" />
                  <div className="text-center">
                    <div className="text-[8px] font-black uppercase tracking-widest text-text-secondary opacity-50 mb-0">
                      Rating
                    </div>
                    <div className="text-xs font-black text-success italic">
                      {program.rating}
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center text-text-secondary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
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
    </DummyPageWrapper>
  );
};

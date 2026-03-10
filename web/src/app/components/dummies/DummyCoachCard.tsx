import { Award, Search, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyCoachCard = () => {
  const { t } = useTranslation();

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.coachCard.pageTitle")}
      locationKey="coachCard"
    >
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-black text-text-secondary uppercase tracking-widest">
            {t("welcomeTour.dummies.coaching.recommended")}
          </h4>
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <Search className="w-3.5 h-3.5" />{" "}
            {t("welcomeTour.dummies.coaching.explore")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border/50 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[100%]" />
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary via-blue-500 to-purple-600 p-[2px] shadow-xl">
                  <div className="w-full h-full rounded-[1.9rem] bg-surface flex items-center justify-center overflow-hidden text-2xl font-black text-primary/40">
                    M
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-surface rounded-full border-2 border-border flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-success rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-black text-text-primary">
                  {t("welcomeTour.dummies.coaching.name")}
                </h4>
                <p className="text-xs font-bold text-primary uppercase tracking-wider italic">
                  {t("welcomeTour.dummies.coaching.title")}
                </p>
              </div>

              <div className="flex w-full gap-2">
                <div className="flex-1 bg-background-secondary/50 rounded-2xl p-2 border border-border/40">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-black">
                      {t("welcomeTour.dummies.coaching.rating")}
                    </span>
                  </div>
                  <p className="text-[8px] font-bold text-text-secondary uppercase opacity-60">
                    Rating
                  </p>
                </div>
                <div className="flex-1 bg-background-secondary/50 rounded-2xl p-2 border border-border/40">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Award className="w-3 h-3 text-primary" />
                    <span className="text-sm font-black">
                      {t("welcomeTour.dummies.coaching.experience")}
                    </span>
                  </div>
                  <p className="text-[8px] font-bold text-text-secondary uppercase opacity-60">
                    Experience
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <div className="flex flex-wrap gap-2 justify-center text-text-secondary">
                <span className="px-3 py-1 bg-surface border border-border rounded-full text-[10px] font-black uppercase tracking-wider">
                  {t("welcomeTour.dummies.coaching.specialization")}
                </span>
                <span className="px-3 py-1 bg-surface border border-border rounded-full text-[10px] font-black uppercase tracking-wider">
                  {t("welcomeTour.dummies.coaching.weightLoss")}
                </span>
              </div>

              <button className="w-full py-3 bg-background-secondary hover:bg-background-secondary/80 text-text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest border border-border transition-all">
                {t("welcomeTour.dummies.coaching.viewProfile")}
              </button>
            </div>
          </div>

          <div className="bg-surface/30 border border-border/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 opacity-50 blur-[0.5px] pointer-events-none hidden md:flex">
            <div className="w-20 h-20 rounded-full bg-border/20 animate-pulse" />
            <div className="h-5 w-40 bg-border/20 rounded-full animate-pulse" />
            <div className="h-3 w-56 bg-border/20 rounded-full animate-pulse" />
            <div className="mt-4 w-full h-32 bg-border/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </DummyPageWrapper>
  );
};

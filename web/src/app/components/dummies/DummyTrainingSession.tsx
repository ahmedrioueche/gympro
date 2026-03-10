import {
  Activity,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyTrainingSession = () => {
  const { t } = useTranslation();
  const { isRtl } = useLanguageStore();

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.trainingSession.pageTitle")}
      locationKey="trainingSession"
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Session Card */}
        <div className="md:col-span-2 bg-surface border border-border/50 rounded-2xl p-4 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%] -mr-10 -mt-10" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="text-primary w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-primary uppercase tracking-wider block leading-tight">
                    {t("welcomeTour.dummies.training.live")}
                  </span>
                  <h4 className="text-lg font-black text-text-primary leading-none">
                    {t("welcomeTour.dummies.training.legPress")}
                  </h4>
                </div>
              </div>
              <div className="text-end">
                <span className="text-xl font-black text-text-primary">
                  65%
                </span>
              </div>
            </div>

            <div className="h-2 w-full bg-border/30 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
            </div>

            <div className="bg-background-secondary/50 rounded-2xl p-4 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center">
                  <CheckCircle2 className="text-success w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-text-primary">
                    {t("welcomeTour.dummies.training.exercise")}
                  </p>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                    {t("welcomeTour.dummies.training.volume")}
                  </p>
                </div>
              </div>
              {isRtl ? (
                <ChevronLeft className="text-text-secondary w-5 h-5" />
              ) : (
                <ChevronRight className="text-text-secondary w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        {/* Side Metrics */}
        <div className="space-y-3">
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
                {t("welcomeTour.dummies.training.rest")}
              </span>
            </div>
            <div className="text-2xl font-black text-text-primary italic">
              00:45
            </div>
          </div>

          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
                {t("welcomeTour.dummies.training.volume")}
              </span>
            </div>
            <div className="text-2xl font-black text-text-primary italic">
              1,240<span className="text-xs ml-1 opacity-60">kg</span>
            </div>
          </div>
        </div>
      </div>
    </DummyPageWrapper>
  );
};

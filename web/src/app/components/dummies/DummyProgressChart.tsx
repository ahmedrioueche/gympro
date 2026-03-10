import { Activity, TrendingUp, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyProgressChart = () => {
  const { t } = useTranslation();

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.progressChart.pageTitle")}
      locationKey="progressChart"
    >
      <div className="w-full max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <TrendingUp className="text-orange-500 w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-text-primary">
                    {t("welcomeTour.dummies.progress.weekly")}
                  </h4>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                    {t("welcomeTour.dummies.progress.last7Days")}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-success/10 text-success rounded-full text-[10px] font-black border border-success/20">
                {t("welcomeTour.dummies.progress.gain")}
              </span>
            </div>

            <div className="relative h-40 flex items-end justify-between gap-3 px-2 border-b border-l border-border/20 pb-2">
              {[40, 65, 45, 80, 55, 95, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ${
                      i === 5
                        ? "bg-gradient-to-t from-primary to-blue-400"
                        : "bg-primary/20 group-hover:bg-primary/40"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[8px] font-bold text-text-secondary uppercase">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border/50 rounded-3xl p-6 shadow-2xl space-y-6">
            <h4 className="text-lg font-black text-text-primary mb-4 italic uppercase tracking-widest opacity-60 flex items-center gap-2">
              <Activity className="w-4 h-4" />{" "}
              {t("welcomeTour.dummies.progress.metrics")}
            </h4>
            <div className="space-y-4 text-text-primary">
              <div className="p-4 bg-background-secondary/30 rounded-2xl border border-border/40 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      {t("welcomeTour.dummies.progress.weight")}
                    </span>
                  </div>
                  <span className="text-sm font-black text-text-primary italic">
                    82.5 kg
                  </span>
                </div>
              </div>
              <div className="p-4 bg-background-secondary/30 rounded-2xl border border-border/40 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-success" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      {t("welcomeTour.dummies.progress.muscle")}
                    </span>
                  </div>
                  <span className="text-sm font-black text-text-primary italic">
                    42.1 kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DummyPageWrapper>
  );
};

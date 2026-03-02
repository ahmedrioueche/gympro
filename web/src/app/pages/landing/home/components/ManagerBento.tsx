import {
  BarChart3,
  Bell,
  CreditCard,
  DollarSign,
  Dumbbell,
  Settings,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

function ManagerBento() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  // Mini bar-chart data for the revenue visual
  const bars = useMemo(
    () => [35, 52, 44, 68, 58, 75, 62, 80, 72, 90, 85, 95],
    [],
  );

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="max-w-7xl mx-auto w-full relative"
    >
      {/* Side label */}
      <div className="absolute -left-20 top-0 h-full items-center hidden xl:flex">
        <span className="text-xs font-black tracking-[1em] uppercase -rotate-90 text-primary opacity-50 whitespace-nowrap">
          {t("landing.manager.sideLabel")}
        </span>
      </div>

      {/* Header */}
      <div
        className="mb-8 md:mb-12 hero-animate"
        style={
          inView
            ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
            : undefined
        }
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            {t("landing.manager.title")}
          </h2>
        </div>
        <p className="text-slate-400 max-w-md">
          {t("landing.manager.subtitle")}
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-3 md:gap-4 auto-rows-auto">
        {/* ——— Large left: Revenue Analytics ——— */}
        <div
          className="col-span-12 md:col-span-7 md:row-span-2 glass-card rounded-3xl glow-border-primary p-6 md:p-8 flex flex-col overflow-hidden group hover:border-primary/60 transition-all duration-500 relative hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.25s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/0 group-hover:bg-primary/10 blur-[80px] rounded-full transition-all duration-700" />

          {/* Mini header */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {t("landing.manager.revenueAnalytics")}
                </h3>
                <p className="text-xs text-slate-500">
                  {t("landing.manager.revenueAnalyticsTag")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">+24%</span>
            </div>
          </div>

          {/* Revenue amount */}
          <div className="mb-6 relative z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-white tabular-nums">
                $48,250
              </span>
              <span className="text-sm text-slate-500 font-medium">
                {t("landing.manager.thisMonth")}
              </span>
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="flex-1 flex items-end gap-1.5 relative z-10 min-h-[120px]">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md transition-all duration-500"
                style={{
                  height: `${h}%`,
                  background:
                    i === bars.length - 1
                      ? "linear-gradient(to top, var(--color-primary), #9333ea)"
                      : i >= bars.length - 3
                        ? "rgba(19, 91, 236, 0.5)"
                        : "rgba(255,255,255,0.08)",
                  animation: `chartDraw 0.6s ease-out ${0.1 * i}s both`,
                }}
              />
            ))}
          </div>

          {/* Bottom stats row */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/5 relative z-10">
            <div>
              <p className="text-xs text-slate-500">
                {t("landing.manager.subscriptions")}
              </p>
              <p className="text-lg font-bold text-white">342</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">
                {t("landing.manager.mrr")}
              </p>
              <p className="text-lg font-bold text-white">$12.4k</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">
                {t("landing.manager.churn")}
              </p>
              <p className="text-lg font-bold text-emerald-400">2.1%</p>
            </div>
          </div>
        </div>

        {/* ——— Top-right: Member Management ——— */}
        <div
          className="col-span-12 md:col-span-5 glass-card rounded-3xl p-6 flex items-center gap-5 group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.4s forwards" }
              : undefined
          }
        >
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/0 group-hover:bg-primary/8 blur-[60px] rounded-full transition-all duration-500" />

          <div className="size-16 md:size-20 shrink-0 rounded-2xl bg-gradient-to-br from-primary/15 to-purple-500/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
            <Users className="w-7 h-7 md:w-8 md:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-base md:text-lg text-white mb-1">
              {t("landing.manager.memberManagement")}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("landing.manager.memberManagementDesc")}
            </p>
            {/* Mini stat pills */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-medium">
                1,247 {t("landing.manager.active")}
              </span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5 font-medium">
                +38 {t("landing.manager.thisWeek")}
              </span>
            </div>
          </div>
        </div>

        {/* ——— Middle-right: Subscription Plans ——— */}
        <div
          className="col-span-12 md:col-span-5 glass-card rounded-3xl p-6 flex items-center gap-5 group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.55s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/0 group-hover:bg-purple-500/8 blur-[60px] rounded-full transition-all duration-500" />

          <div className="size-16 md:size-20 shrink-0 rounded-2xl bg-gradient-to-br from-purple-500/15 to-primary/10 flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/40 transition-colors duration-300">
            <CreditCard className="w-7 h-7 md:w-8 md:h-8 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-base md:text-lg text-white mb-1">
              {t("landing.manager.subscriptionPlans")}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("landing.manager.subscriptionPlansDesc")}
            </p>
          </div>
        </div>

        {/* ——— Bottom row: 3 small feature cards ——— */}
        {/* Staff Management */}
        <div
          className="col-span-6 md:col-span-4 glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[160px] md:min-h-[180px] group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.7s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/0 group-hover:bg-primary/8 blur-[50px] rounded-full transition-all duration-500" />
          <div className="size-10 md:size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors duration-300">
            <UserPlus className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="font-bold text-sm md:text-base text-white">
              {t("landing.manager.staffManagement")}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("landing.manager.staffManagementDesc")}
            </p>
          </div>
        </div>

        {/* Gym & Facilities */}
        <div
          className="col-span-6 md:col-span-4 glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[160px] md:min-h-[180px] group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.85s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/0 group-hover:bg-primary/8 blur-[50px] rounded-full transition-all duration-500" />
          <div className="size-10 md:size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors duration-300">
            <Dumbbell className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="font-bold text-sm md:text-base text-white">
              {t("landing.manager.gymFacilities")}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("landing.manager.gymFacilitiesDesc")}
            </p>
          </div>
        </div>

        {/* Alerts & Settings */}
        <div
          className="col-span-12 md:col-span-4 glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[160px] md:min-h-[180px] group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 1.0s forwards" }
              : undefined
          }
        >
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/0 group-hover:bg-primary/8 blur-[50px] rounded-full transition-all duration-500" />
          <div className="flex items-center gap-2">
            <div className="size-10 md:size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors duration-300">
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="size-10 md:size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors duration-300">
              <Settings className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="font-bold text-sm md:text-base text-white">
              {t("landing.manager.alertsSettings")}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("landing.manager.alertsSettingsDesc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ManagerBento;

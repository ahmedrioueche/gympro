import { Activity, Award, Bell, UserPlus, Users } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";
import { LandingSectionTitle } from "../../../../components/landing/LandingSectionTitle";

export function MemberLifecycle() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="max-w-7xl mx-auto px-6 md:px-10"
    >
      <LandingSectionTitle
        title={t("landing.managerPage.lifecycle.title")}
        Icon={Users}
        inView={inView}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="md:col-span-2 glass-card rounded-3xl glow-border-primary p-8 md:p-10 flex flex-col justify-between group hover:border-primary/60 transition-all duration-500 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.2s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all" />
          <div className="relative z-10">
            <UserPlus className="text-primary w-12 h-12 mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-white">
              {t("landing.managerPage.lifecycle.onboardingTitle")}
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              {t("landing.managerPage.lifecycle.onboardingDesc")}
            </p>
          </div>
          <div className="mt-8 flex gap-3 relative z-10">
            <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full">
              {t("landing.managerPage.lifecycle.onboardingTag1")}
            </span>
            <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full">
              {t("landing.managerPage.lifecycle.onboardingTag2")}
            </span>
          </div>
        </div>

        <div
          className="glass-card rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.3s forwards" }
              : undefined
          }
        >
          <Activity className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.lifecycle.churnTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.lifecycle.churnDesc")}
          </p>
        </div>

        <div
          className="glass-card rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.4s forwards" }
              : undefined
          }
        >
          <Users className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.lifecycle.segmentTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.lifecycle.segmentDesc")}
          </p>
        </div>

        <div
          className="glass-card rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.5s forwards" }
              : undefined
          }
        >
          <Award className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.lifecycle.rewardsTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.lifecycle.rewardsDesc")}
          </p>
        </div>

        <div
          className="glass-card rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.6s forwards" }
              : undefined
          }
        >
          <Bell className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.lifecycle.pushTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.lifecycle.pushDesc")}
          </p>
        </div>
      </div>
    </section>
  );
}

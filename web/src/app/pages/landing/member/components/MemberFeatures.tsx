import { CheckCircle, Dumbbell, Map, TrendingUp, Users } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";
import { LandingSectionTitle } from "../../../../components/landing/LandingSectionTitle";

export function MemberFeatures() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="max-w-7xl mx-auto px-6 md:px-10"
    >
      <LandingSectionTitle
        title={t("landing.memberPage.features.title")}
        subtitle={t("landing.memberPage.features.subtitle")}
        Icon={TrendingUp}
        colorClassName="text-secondary"
        bgClassName="bg-secondary/10"
        borderClassName="border-secondary/20"
        inView={inView}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[240px]">
        {/* Training & Programs */}
        <div
          className="md:col-span-8 glass-card rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.2s forwards" }
              : undefined
          }
        >
          <div className="relative z-10">
            <Dumbbell className="text-secondary w-12 h-12 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {t("landing.memberPage.features.trainingTitle")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {["personalized", "library", "logger", "ai"].map((key) => (
                <div
                  key={key}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <CheckCircle className="text-secondary w-5 h-5" />
                  <span>
                    {t(`landing.memberPage.features.training.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-l from-secondary to-transparent" />
        </div>

        {/* Progress Tracking */}
        <div
          className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-secondary/40 transition-all duration-300 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.3s forwards" }
              : undefined
          }
        >
          <TrendingUp className="text-secondary w-14 h-14 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold text-white">
            {t("landing.memberPage.features.trackingTitle")}
          </h3>
          <p className="text-slate-400 text-sm mt-2">
            {t("landing.memberPage.features.trackingDesc")}
          </p>
        </div>

        {/* Social & Coaching */}
        <div
          className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between bg-secondary/5 hover:bg-secondary/10 transition-colors hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.4s forwards" }
              : undefined
          }
        >
          <div>
            <Users className="text-white w-10 h-10 mb-6" />
            <h3 className="text-xl font-bold text-white">
              {t("landing.memberPage.features.socialTitle")}
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            {["leaderboards", "messaging", "challenges", "form"].map((key) => (
              <li key={key}>
                • {t(`landing.memberPage.features.social.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* Account & Booking */}
        <div
          className="md:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center group hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.5s forwards" }
              : undefined
          }
        >
          <div className="max-w-md relative z-10">
            <h3 className="text-2xl font-bold text-white mb-3">
              {t("landing.memberPage.features.accountTitle")}
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {t("landing.memberPage.features.accountDesc")}
            </p>
            <div className="flex flex-wrap gap-4">
              {["discovery", "booking", "payments"].map((key) => (
                <span
                  key={key}
                  className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-300 font-medium transition-colors hover:border-secondary/40"
                >
                  {t(`landing.memberPage.features.accountTags.${key}`)}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-700">
            <Map className="w-56 h-56 text-secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}

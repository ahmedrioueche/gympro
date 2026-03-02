import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

export function CoachCTA() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div
          className="glass-card glow-border-cyan p-12 lg:p-20 rounded-[2.5rem] hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
              : undefined
          }
        >
          <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight text-white tracking-tight">
            {t("landing.coachPage.cta.titlePart1")} <br />
            <span className="text-primary">
              {t("landing.coachPage.cta.titlePart2")}
            </span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("landing.coachPage.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-[#101f22] px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/30 active:scale-95">
              {t("landing.coachPage.cta.primary")}
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all border border-white/10">
              {t("landing.coachPage.cta.secondary")}
            </button>
          </div>
          <p className="mt-8 text-slate-500 text-sm font-medium uppercase tracking-widest">
            {t("landing.coachPage.cta.footer")}
          </p>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/20 blur-[150px] rounded-full -z-10"
        style={{ animation: "heroPulseGlow 5s ease-in-out infinite" }}
      ></div>
    </section>
  );
}

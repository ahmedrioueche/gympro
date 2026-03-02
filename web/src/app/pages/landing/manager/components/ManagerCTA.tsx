import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

export function ManagerCTA() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 px-6 text-center"
    >
      <div
        className="max-w-4xl mx-auto glass-card glow-border-primary p-12 md:p-20 rounded-[2.5rem] relative overflow-hidden hero-animate"
        style={
          inView
            ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
            : undefined
        }
      >
        <div
          className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 blur-3xl rounded-full"
          style={{ animation: "heroPulseGlow 6s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary/10 blur-3xl rounded-full"
          style={{ animation: "heroPulseGlow 4s ease-in-out infinite reverse" }}
        />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">
            {t("landing.managerPage.cta.title")}
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("landing.managerPage.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95">
              {t("landing.managerPage.cta.primary")}
            </button>
            <button className="border border-slate-700 hover:border-primary text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:bg-white/5">
              {t("landing.managerPage.cta.secondary")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

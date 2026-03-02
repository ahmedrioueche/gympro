import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

export function MemberHero() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 min-h-[70vh]"
    >
      <div
        className="flex flex-col gap-8 hero-animate"
        style={
          inView
            ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
            : undefined
        }
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest w-fit">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          {t("landing.memberPage.hero.badge")}
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white">
          {t("landing.memberPage.hero.titlePart1")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-purple-400">
            {t("landing.memberPage.hero.titlePart2")}
          </span>{" "}
          {t("landing.memberPage.hero.titlePart3")}
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
          {t("landing.memberPage.hero.description")}
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-secondary hover:scale-105 transition-transform text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl shadow-secondary/25 active:scale-95">
            {t("landing.memberPage.hero.ctaPrimary")}
          </button>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-8 rounded-xl text-lg backdrop-blur-sm transition-colors">
            {t("landing.memberPage.hero.ctaSecondary")}
          </button>
        </div>
      </div>

      <div
        className="relative group hero-animate"
        style={
          inView
            ? { animation: "heroFadeUp 0.6s ease-out 0.3s forwards" }
            : undefined
        }
      >
        <div
          className="absolute -inset-4 bg-secondary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"
          style={{ animation: "heroPulseGlow 4s ease-in-out infinite" }}
        ></div>
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 aspect-[4/5] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-[#101622]"></div>
          {/* Decorative Phone Mockup */}
          <div className="w-64 h-[500px] bg-[#101622] rounded-[3rem] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden transition-transform duration-700 group-hover:scale-105">
            <div className="absolute top-0 w-full h-6 bg-slate-800 flex justify-center items-end pb-1">
              <div className="w-16 h-1 bg-slate-700 rounded-full"></div>
            </div>
            <div className="p-4 pt-8 space-y-4">
              <div className="h-8 w-24 bg-secondary/20 rounded-lg"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 w-full bg-slate-800/50 rounded-xl border border-secondary/20 p-2 flex gap-3"
                  >
                    <div className="size-12 bg-secondary/40 rounded-lg shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
                      <div className="h-2 w-full bg-slate-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-10 w-full bg-secondary rounded-xl flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-widest">
                START WORKOUT
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, PlayCircle } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

export function CoachHero() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative pt-20 pb-32 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent blur-[120px] -z-10"></div>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div
          className="space-y-8 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
              : undefined
          }
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t("landing.coachPage.hero.badge")}
          </div>
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white">
            {t("landing.coachPage.hero.titlePart1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">
              {t("landing.coachPage.hero.titlePart2")}
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
            {t("landing.coachPage.hero.description")}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="h-14 px-8 bg-primary text-[#101f22] font-black rounded-xl hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-primary/20 active:scale-95">
              {t("landing.coachPage.hero.ctaPrimary")}{" "}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="h-14 px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl flex items-center gap-2 transition-all backdrop-blur-sm">
              <PlayCircle className="w-5 h-5" />{" "}
              {t("landing.coachPage.hero.ctaSecondary")}
            </button>
          </div>
        </div>

        <div
          className="relative hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.3s forwards" }
              : undefined
          }
        >
          <div className="glass-card glow-border-cyan rounded-2xl p-4 rotate-2 shadow-2xl relative z-10 group transition-transform duration-700 hover:rotate-0">
            <img
              alt="Coach Dashboard Mockup"
              className="rounded-xl w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbj73F3QhZrzeVa6SBKZJmeR2sO2C-YLDlWAhsTFfHvjXZMfKSvHgEcopQDADYOKLbyoJt20Pe4GSA97np7JFOdspTK14f4TGxBw_C-v5uZdRXPJ-v0Jw6OX-8UGMI_y19gZ_uLU0081u1nITBDf7WfP1Bjgqcb1XdjqVpinpDjmjjVRdTFNAyKVVk7ERH6dbQtp1Ne79w4X28cTLopOWryV482FyjJy-XSIiercr5RlM8-gCFziCTfOaBg8LKKRjKezcjdi2Rlsk"
            />
          </div>
          <div
            className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full"
            style={{ animation: "heroPulseGlow 4s ease-in-out infinite" }}
          ></div>
          <div
            className="absolute -bottom-10 -left-10 w-60 h-60 bg-cyan-500/10 blur-3xl rounded-full"
            style={{
              animation: "heroPulseGlow 6s ease-in-out infinite reverse",
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}

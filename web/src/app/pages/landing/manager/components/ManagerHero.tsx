import { Link } from "@tanstack/react-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import { useInView } from "../../../../../hooks/useInView";

export function ManagerHero() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative pt-20 overflow-hidden min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        <div
          className="z-10 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
              : undefined
          }
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 text-white">
            {t("landing.managerPage.hero.titlePart1")}{" "}
            <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              {t("landing.managerPage.hero.titlePart2")}
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed">
            {t("landing.managerPage.hero.description")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={APP_PAGES.signUp.link}
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/25 active:scale-95"
            >
              {t("landing.managerPage.hero.ctaPrimary")}
            </Link>
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
          <div
            className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"
            style={{ animation: "heroPulseGlow 4s ease-in-out infinite" }}
          ></div>
          <div className="relative glass-card glow-border-primary rounded-2xl overflow-hidden aspect-video shadow-2xl group transition-all duration-500 hover:border-primary/60">
            <img
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              alt="Manager dashboard"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA-3GNltOpa2klPmekwUGtn7GZvK92RsPrWDE_6MfDZTETrBhI-tK92nNQwV6wNdmFA9GcwL0nKs3qVKauy3MZXDqEaUWlqhlFURnue9bz7Lz-TQ7H45Y2fhShESbZZ0b24uARBA8BPy8GvSPOi2gJ_FRsF2Hcaw7NnuBB9Ax7T67__GShl6a_ANMErAlgptdIVASl0DBrjIUBbQJbBdGEVmQVP9lMxJHYb-vqoffD2Jx_svnv1AGK4qL75FJukh0lFLr8VjFyc-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

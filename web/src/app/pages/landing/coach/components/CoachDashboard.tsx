import { BarChart3, Layout, Users } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

export function CoachDashboard() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="mb-16 text-center max-w-2xl mx-auto hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
              : undefined
          }
        >
          <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 text-white tracking-tight">
            {t("landing.coachPage.dashboard.title")}
          </h2>
          <p className="text-slate-400">
            {t("landing.coachPage.dashboard.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[700px]">
          {/* Pro Program Builder */}
          <div
            className="md:col-span-2 md:row-span-2 glass-card glow-border-cyan rounded-xl p-8 flex flex-col justify-between group overflow-hidden relative hero-animate"
            style={
              inView
                ? { animation: "heroFadeUp 0.6s ease-out 0.2s forwards" }
                : undefined
            }
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-6">
                <Layout className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                {t("landing.coachPage.dashboard.builderTitle")}
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                {t("landing.coachPage.dashboard.builderDesc")}
              </p>
            </div>
            <div className="mt-8 relative z-10">
              <img
                alt="Program Builder Interface"
                className="rounded-lg shadow-2xl border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB15vM7-FvHK0-G7CFmHra_64YGsdjSL08V20VoDCyqQvd4OSBL70bpqRGZyuNFkq4dH4Zo3GoxLHSNIi-e8YwmSdFDi7yPiQMqkq9lC2zLDjVhGZFtU25tUlXz-R9wZZSFjoKzlijBgydocXJ4FT7P_1q7z0WmQrSpncpGFaozKmN72BhJ8F0V97PfJUyVDKGuha6h93JO00GgpJJ7dIybMYxR0wdvlwU47-nlXH0pQfu3bqLXNIeuU9S8fBvrKtq1hxecVLF7pME"
              />
            </div>
            <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
          </div>

          {/* CRM for Coaches */}
          <div
            className="md:col-span-2 md:row-span-1 glass-card glow-border-cyan rounded-xl p-8 flex flex-col md:flex-row gap-6 items-center hero-animate"
            style={
              inView
                ? { animation: "heroFadeUp 0.6s ease-out 0.3s forwards" }
                : undefined
            }
          >
            <div className="flex-1">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-4">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                {t("landing.coachPage.dashboard.crmTitle")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t("landing.coachPage.dashboard.crmDesc")}
              </p>
            </div>
            <div className="flex-1 w-full relative overflow-hidden rounded-lg">
              <img
                alt="CRM Dashboard"
                className="rounded-lg opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXhgmaiKiFeMCwL-aQcjaLlAZAQ-2AASVLVhkG9sGH1S01ykgTwL7ooQe9zsynf8G0c-0K_vXUTR23rfwq-gvqeaT1Dydf7groAAU5DImxj35cvGehJlDI-j5L9zHpqY-2NF5ooxJh7_mzVfNc4KJsFOqfuUMsBSObw_m4gTGlogOiYr4ZixvePgULYeGsqVLv-h03d_eWLSzZsyzG-PuFVglMbeRNoh8jiHdFHs-NN7TpHNBMdpLR-6qbYtqWa12Hf6tz0k9LLQ0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
            </div>
          </div>

          {/* Progress Heatmaps */}
          <div
            className="md:col-span-1 md:row-span-1 glass-card rounded-xl p-6 flex flex-col hero-animate"
            style={
              inView
                ? { animation: "heroFadeUp 0.6s ease-out 0.4s forwards" }
                : undefined
            }
          >
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-4 text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">
              {t("landing.coachPage.dashboard.heatmapsTitle")}
            </h3>
            <div className="grid grid-cols-7 gap-1 mt-auto">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${
                    [2, 3, 4, 8, 9, 13].includes(i)
                      ? "bg-primary"
                      : "bg-primary/20"
                  }`}
                  style={{ opacity: 0.3 + Math.random() * 0.7 }}
                />
              ))}
            </div>
            <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">
              {t("landing.coachPage.dashboard.heatmapsIndex")}
            </p>
          </div>

          {/* Earnings Tracking */}
          <div
            className="md:col-span-1 md:row-span-1 bg-primary rounded-xl p-6 flex flex-col justify-between text-[#101f22] hero-animate shadow-xl shadow-primary/20"
            style={
              inView
                ? { animation: "heroFadeUp 0.6s ease-out 0.5s forwards" }
                : undefined
            }
          >
            <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black mb-1">$12.4k</div>
              <p className="text-[#101f22]/70 text-xs font-bold uppercase tracking-tighter">
                {t("landing.coachPage.dashboard.earningsStat")}
              </p>
            </div>
            <h3 className="text-lg font-bold">
              {t("landing.coachPage.dashboard.earningsTitle")}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}

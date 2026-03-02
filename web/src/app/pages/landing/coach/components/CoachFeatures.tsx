import {
  Building2,
  CreditCard,
  Library,
  MessageSquare,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

export function CoachFeatures() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  const features = [
    { icon: Building2, key: "multiGym" },
    { icon: Library, key: "library" },
    { icon: CreditCard, key: "payments" },
    { icon: Settings, key: "nutrition" },
    { icon: MessageSquare, key: "messaging" },
    { icon: Smartphone, key: "biometric" },
    { icon: RefreshCcw, key: "renewals" },
    { icon: ShieldCheck, key: "whiteLabel" },
  ];

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div
            className="max-w-xl hero-animate"
            style={
              inView
                ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
                : undefined
            }
          >
            <h2 className="text-4xl font-extrabold mb-4 text-white tracking-tight">
              {t("landing.coachPage.features.titlePart1")} <br />
              <span className="text-primary">
                {t("landing.coachPage.features.titlePart2")}
              </span>
            </h2>
            <p className="text-slate-400">
              {t("landing.coachPage.features.subtitle")}
            </p>
          </div>
          <button className="bg-white/5 border border-white/10 px-6 py-3 rounded-lg text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm">
            {t("landing.coachPage.features.cta")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={item.key}
              className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group hero-animate"
              style={
                inView
                  ? {
                      animation: `heroFadeUp 0.6s ease-out ${0.2 + idx * 0.05}s forwards`,
                    }
                  : undefined
              }
            >
              <item.icon className="text-primary w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-bold mb-2 text-white">
                {t(`landing.coachPage.features.items.${item.key}.title`)}
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t(`landing.coachPage.features.items.${item.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

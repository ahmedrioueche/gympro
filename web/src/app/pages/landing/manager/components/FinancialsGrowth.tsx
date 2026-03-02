import {
  CreditCard,
  DollarSign,
  FileText,
  PieChart,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

export function FinancialsGrowth() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="max-w-7xl mx-auto px-6 py-24 mb-24"
    >
      <div
        className="flex items-center gap-4 mb-12 hero-animate"
        style={
          inView
            ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
            : undefined
        }
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30"></div>
        <h2 className="text-2xl md:text-3xl font-black px-6 text-white uppercase tracking-tighter">
          {t("landing.managerPage.financials.title")}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          className="md:col-span-2 glass-card rounded-3xl glow-border-primary p-8 md:p-10 bento-item hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.2s forwards" }
              : undefined
          }
        >
          <DollarSign className="text-primary w-12 h-12 mb-6" />
          <h3 className="text-2xl font-bold mb-4 text-white">
            {t("landing.managerPage.financials.subscriptionsTitle")}
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed">
            {t("landing.managerPage.financials.subscriptionsDesc")}
          </p>
        </div>

        <div
          className="md:col-span-2 glass-card rounded-3xl p-8 md:p-10 bento-item flex items-center gap-8 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.3s forwards" }
              : undefined
          }
        >
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4 text-white">
              {t("landing.managerPage.financials.dashboardsTitle")}
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t("landing.managerPage.financials.dashboardsDesc")}
            </p>
          </div>
          <div className="hidden sm:flex size-32 bg-primary/10 border border-primary/20 rounded-full items-center justify-center shrink-0">
            <PieChart className="text-primary w-14 h-14" />
          </div>
        </div>

        <div
          className="glass-card rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.4s forwards" }
              : undefined
          }
        >
          <FileText className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.financials.taxTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.financials.taxDesc")}
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
          <ShoppingCart className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.financials.posTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.financials.posDesc")}
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
          <CreditCard className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.financials.multiTierTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.financials.multiTierDesc")}
          </p>
        </div>

        <div
          className="glass-card rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.7s forwards" }
              : undefined
          }
        >
          <Wallet className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.financials.expenseTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.financials.expenseDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}

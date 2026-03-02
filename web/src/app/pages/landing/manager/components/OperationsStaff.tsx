import { Calendar, Lock, Package, ShieldCheck } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";

export function OperationsStaff() {
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
          {t("landing.managerPage.operations.title")}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="glass-card rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.2s forwards" }
              : undefined
          }
        >
          <ShieldCheck className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.operations.permissionsTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.operations.permissionsDesc")}
          </p>
        </div>

        <div
          className="glass-card rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.3s forwards" }
              : undefined
          }
        >
          <Calendar className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.operations.schedulingTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.operations.schedulingDesc")}
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
          <Lock className="text-primary w-10 h-10 mb-6" />
          <h3 className="text-xl font-bold mb-4 text-white">
            {t("landing.managerPage.operations.accessTitle")}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {t("landing.managerPage.operations.accessDesc")}
          </p>
        </div>

        <div
          className="md:col-span-3 glass-card rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-12 items-center group hover:border-primary/40 transition-all duration-500 overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.5s forwards" }
              : undefined
          }
        >
          <div className="md:w-1/2">
            <Package className="text-primary w-12 h-12 mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-white">
              {t("landing.managerPage.operations.assetsTitle")}
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t("landing.managerPage.operations.assetsDesc")}
            </p>
          </div>
          <div className="md:w-1/2 w-full aspect-video bg-background-dark/50 rounded-2xl overflow-hidden border border-white/5 relative shadow-2xl">
            <img
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              alt="Equipment tracking"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRpxSUrJZSDOz8_OhW486sh-W4ICeo69dlvdotkWKARDEr7dVWt57QP4Pe5Tc9pOdS-0sudg-dqLgUKNIFhk-DKskMdLbMb7XfbNDwkTi7OBD0HLoE8HrRN4TA1Kyh6SLmfKlrhtz_MC4P5y9f9YuGmJr-HttYinnwdQnr9NN9rr3TrovGhtxYPpoh8G9WsFb9l5zNKhkoV5JBXjoDF2RkwwJkP0EgK2MB6uC6yHHvFA6SxE2dztlMdxH4qFCKydjqOUVm5AxtLj8"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

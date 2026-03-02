import {
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  Dumbbell,
  MessageSquare,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";
import { LandingSectionTitle } from "../../../../components/landing/LandingSectionTitle";

function CoachBento() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  // Client roster mock data
  const clients = useMemo(
    () => [
      { name: "AK", status: "active" },
      { name: "MR", status: "active" },
      { name: "JD", status: "active" },
      { name: "SL", status: "pending" },
      { name: "NB", status: "active" },
    ],
    [],
  );

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="coach"
      className="max-w-7xl mx-auto w-full relative px-6 md:px-10"
    >
      {/* Side label */}
      <div className="absolute -left-20 top-0 h-full items-center hidden xl:flex">
        <span className="text-xs font-black tracking-[1em] uppercase -rotate-90 text-cyan-500 opacity-50 whitespace-nowrap">
          {t("landing.coach.sideLabel")}
        </span>
      </div>

      <LandingSectionTitle
        title={t("landing.coach.title")}
        subtitle={t("landing.coach.subtitle")}
        Icon={BookOpen}
        colorClassName="text-cyan-400"
        bgClassName="bg-cyan-500/10"
        borderClassName="border-cyan-500/20"
        inView={inView}
      />

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-3 md:gap-4 auto-rows-auto">
        {/* ——— Large left: Client Management ——— */}
        <div
          className="col-span-12 md:col-span-7 md:row-span-2 glass-card rounded-3xl glow-border-cyan p-6 md:p-8 flex flex-col overflow-hidden group hover:border-cyan-500/60 transition-all duration-500 relative hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.25s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/0 group-hover:bg-cyan-500/10 blur-[80px] rounded-full transition-all duration-700" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {t("landing.coach.clientManagement")}
                </h3>
                <p className="text-xs text-slate-500">
                  {t("landing.coach.clientManagementTag")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1">
              <span className="text-xs font-bold text-cyan-400">
                24 {t("landing.coach.activeClients")}
              </span>
            </div>
          </div>

          {/* Client list */}
          <div className="space-y-2.5 relative z-10 flex-1">
            {clients.map((client, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 hover:border-cyan-500/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-300">
                      {client.name}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {t("landing.coach.clientName")} {i + 1}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {t("landing.coach.lastSession")}: 2d ago
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    client.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {client.status === "active"
                    ? t("landing.coach.active")
                    : t("landing.coach.pending")}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom stat */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/5 relative z-10">
            <div>
              <p className="text-xs text-slate-500">
                {t("landing.coach.sessionsThisWeek")}
              </p>
              <p className="text-lg font-bold text-white">18</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">
                {t("landing.coach.completionRate")}
              </p>
              <p className="text-lg font-bold text-emerald-400">94%</p>
            </div>
          </div>
        </div>

        {/* ——— Top-right: Program Builder ——— */}
        <div
          className="col-span-12 md:col-span-5 glass-card rounded-3xl p-6 flex items-center gap-5 group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.4s forwards" }
              : undefined
          }
        >
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/0 group-hover:bg-cyan-500/8 blur-[60px] rounded-full transition-all duration-500" />

          <div className="size-16 md:size-20 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-teal-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors duration-300">
            <Dumbbell className="w-7 h-7 md:w-8 md:h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-base md:text-lg text-white mb-1">
              {t("landing.coach.programBuilder")}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("landing.coach.programBuilderDesc")}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full px-2.5 py-0.5 font-medium">
                {t("landing.coach.dragDrop")}
              </span>
              <span className="text-xs bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-full px-2.5 py-0.5 font-medium">
                {t("landing.coach.templates")}
              </span>
            </div>
          </div>
        </div>

        {/* ——— Middle-right: Schedule & Booking ——— */}
        <div
          className="col-span-12 md:col-span-5 glass-card rounded-3xl p-6 flex items-center gap-5 group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.55s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-500/0 group-hover:bg-teal-500/8 blur-[60px] rounded-full transition-all duration-500" />

          <div className="size-16 md:size-20 shrink-0 rounded-2xl bg-gradient-to-br from-teal-500/15 to-cyan-500/10 flex items-center justify-center border border-teal-500/20 group-hover:border-teal-500/40 transition-colors duration-300">
            <Calendar className="w-7 h-7 md:w-8 md:h-8 text-teal-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-base md:text-lg text-white mb-1">
              {t("landing.coach.schedule")}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("landing.coach.scheduleDesc")}
            </p>
          </div>
        </div>

        {/* ——— Bottom row: 3 small cards ——— */}
        {/* Exercise Library */}
        <div
          className="col-span-6 md:col-span-4 glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[160px] md:min-h-[180px] group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.7s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-cyan-500/0 group-hover:bg-cyan-500/8 blur-[50px] rounded-full transition-all duration-500" />
          <div className="size-10 md:size-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors duration-300">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="font-bold text-sm md:text-base text-white">
              {t("landing.coach.exerciseLibrary")}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("landing.coach.exerciseLibraryDesc")}
            </p>
          </div>
        </div>

        {/* Analytics */}
        <div
          className="col-span-6 md:col-span-4 glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[160px] md:min-h-[180px] group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.85s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/0 group-hover:bg-cyan-500/8 blur-[50px] rounded-full transition-all duration-500" />
          <div className="size-10 md:size-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors duration-300">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="font-bold text-sm md:text-base text-white">
              {t("landing.coach.analytics")}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("landing.coach.analyticsDesc")}
            </p>
          </div>
        </div>

        {/* Payments & Messaging */}
        <div
          className="col-span-12 md:col-span-4 glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[160px] md:min-h-[180px] group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 1.0s forwards" }
              : undefined
          }
        >
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-cyan-500/0 group-hover:bg-cyan-500/8 blur-[50px] rounded-full transition-all duration-500" />
          <div className="flex items-center gap-2">
            <div className="size-10 md:size-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors duration-300">
              <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="size-10 md:size-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors duration-300">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="font-bold text-sm md:text-base text-white">
              {t("landing.coach.paymentsMessages")}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("landing.coach.paymentsMessagesDesc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoachBento;

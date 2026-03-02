import {
  Activity,
  Calendar,
  CreditCard,
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../../hooks/useInView";
import { LandingSectionTitle } from "../../../../components/landing/LandingSectionTitle";

function MemberBento() {
  const { t } = useTranslation();
  const { ref, inView } = useInView(0.1);

  // Weekly activity dots (M-Su)
  const weekDays = useMemo(
    () => [true, true, false, true, true, true, false],
    [],
  );

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="member"
      className="max-w-7xl mx-auto w-full relative px-6 md:px-10"
    >
      {/* Side label */}
      <div className="absolute -left-20 top-0 h-full items-center hidden xl:flex">
        <span className="text-xs font-black tracking-[1em] uppercase -rotate-90 text-purple-500 opacity-50 whitespace-nowrap">
          {t("landing.member.sideLabel")}
        </span>
      </div>

      <LandingSectionTitle
        title={t("landing.member.title")}
        subtitle={t("landing.member.subtitle")}
        Icon={Dumbbell}
        colorClassName="text-purple-400"
        bgClassName="bg-purple-500/10"
        borderClassName="border-purple-500/20"
        inView={inView}
      />

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-3 md:gap-4 auto-rows-auto">
        {/* ——— Left: Training Programs ——— */}
        <div
          className="col-span-12 md:col-span-5 md:row-span-2 glass-card rounded-3xl glow-border-purple p-6 md:p-8 flex flex-col overflow-hidden group hover:border-purple-500/60 transition-all duration-500 relative hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.25s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/0 group-hover:bg-purple-500/10 blur-[80px] rounded-full transition-all duration-700" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {t("landing.member.trainingPrograms")}
                </h3>
                <p className="text-xs text-slate-500">
                  {t("landing.member.trainingProgramsTag")}
                </p>
              </div>
            </div>
          </div>

          {/* Active program card */}
          <div className="bg-purple-500/5 border border-purple-500/15 rounded-2xl p-4 mb-4 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">
                {t("landing.member.currentProgram")}
              </span>
              <span className="text-xs bg-purple-500/20 text-purple-300 rounded-full px-2.5 py-0.5 font-medium">
                {t("landing.member.week")} 6/8
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500"
                style={{ width: "75%" }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              75% {t("landing.member.complete")}
            </p>
          </div>

          {/* Weekly activity */}
          <div className="relative z-10 mt-auto">
            <p className="text-xs text-slate-500 mb-3 font-medium">
              {t("landing.member.thisWeekActivity")}
            </p>
            <div className="flex items-center gap-2">
              {weekDays.map((active, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                    active
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-white/5 text-slate-600"
                  }`}
                >
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5 relative z-10">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-sm font-bold text-white">12</span>
              <span className="text-xs text-slate-500">
                {t("landing.member.streak")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-sm font-bold text-white">8</span>
              <span className="text-xs text-slate-500">
                {t("landing.member.prs")}
              </span>
            </div>
          </div>
        </div>

        {/* ——— Top-right: Exercise Library ——— */}
        <div
          className="col-span-12 md:col-span-7 glass-card rounded-3xl p-6 flex items-center gap-5 group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.4s forwards" }
              : undefined
          }
        >
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/0 group-hover:bg-purple-500/8 blur-[60px] rounded-full transition-all duration-500" />

          <div className="size-16 md:size-20 shrink-0 rounded-2xl bg-gradient-to-br from-purple-500/15 to-violet-500/10 flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/40 transition-colors duration-300">
            <Dumbbell className="w-7 h-7 md:w-8 md:h-8 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-base md:text-lg text-white mb-1">
              {t("landing.member.exerciseLibrary")}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("landing.member.exerciseLibraryDesc")}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full px-2.5 py-0.5 font-medium">
                200+ {t("landing.member.exercises")}
              </span>
              <span className="text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20 rounded-full px-2.5 py-0.5 font-medium">
                HD {t("landing.member.videos")}
              </span>
            </div>
          </div>
        </div>

        {/* ——— Middle-right: Progress Tracking ——— */}
        <div
          className="col-span-12 md:col-span-7 glass-card rounded-3xl p-6 flex items-center gap-5 group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.55s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-violet-500/0 group-hover:bg-violet-500/8 blur-[60px] rounded-full transition-all duration-500" />

          <div className="size-16 md:size-20 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500/15 to-purple-500/10 flex items-center justify-center border border-violet-500/20 group-hover:border-violet-500/40 transition-colors duration-300">
            <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-violet-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-base md:text-lg text-white mb-1">
              {t("landing.member.progressTracking")}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("landing.member.progressTrackingDesc")}
            </p>
          </div>
        </div>

        {/* ——— Bottom row: 3 small cards ——— */}
        {/* Class Schedule */}
        <div
          className="col-span-6 md:col-span-4 glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[160px] md:min-h-[180px] group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.7s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-purple-500/0 group-hover:bg-purple-500/8 blur-[50px] rounded-full transition-all duration-500" />
          <div className="size-10 md:size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:border-purple-500/40 transition-colors duration-300">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="font-bold text-sm md:text-base text-white">
              {t("landing.member.classSchedule")}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("landing.member.classScheduleDesc")}
            </p>
          </div>
        </div>

        {/* Attendance */}
        <div
          className="col-span-6 md:col-span-4 glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[160px] md:min-h-[180px] group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 0.85s forwards" }
              : undefined
          }
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/0 group-hover:bg-purple-500/8 blur-[50px] rounded-full transition-all duration-500" />
          <div className="size-10 md:size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:border-purple-500/40 transition-colors duration-300">
            <Activity className="w-5 h-5 md:w-6 md:h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="font-bold text-sm md:text-base text-white">
              {t("landing.member.attendance")}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("landing.member.attendanceDesc")}
            </p>
          </div>
        </div>

        {/* Subscriptions */}
        <div
          className="col-span-12 md:col-span-4 glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[160px] md:min-h-[180px] group hover:border-white/20 transition-all duration-300 relative overflow-hidden hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.6s ease-out 1.0s forwards" }
              : undefined
          }
        >
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-500/0 group-hover:bg-purple-500/8 blur-[50px] rounded-full transition-all duration-500" />
          <div className="size-10 md:size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:border-purple-500/40 transition-colors duration-300">
            <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="relative z-10 mt-4">
            <h4 className="font-bold text-sm md:text-base text-white">
              {t("landing.member.subscriptions")}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("landing.member.subscriptionsDesc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MemberBento;

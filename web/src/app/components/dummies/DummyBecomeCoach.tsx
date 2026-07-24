import { Award, Rocket, Target, Users, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyBecomeCoach = () => {
  const { t } = useTranslation();

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.becomeCoach.pageTitle")}
      locationKey="becomeCoach"
    >
      <div className="w-full max-w-4xl bg-primary rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {t("welcomeTour.dummies.becomeCoach.title")}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight italic">
              {t("welcomeTour.dummies.becomeCoach.subtitle")}
            </h2>
            <p className="text-base md:text-lg font-medium text-white/80 max-w-md">
              {t("welcomeTour.dummies.becomeCoach.desc")}
            </p>
            <button className="px-8 py-4 bg-white text-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 transition-all">
              {t("welcomeTour.dummies.becomeCoach.action")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Users,
                label: t("welcomeTour.dummies.becomeCoach.manageClients"),
                val: t("welcomeTour.dummies.becomeCoach.unlimited"),
              },
              {
                icon: Target,
                label: t("welcomeTour.dummies.becomeCoach.setGoals"),
                val: t("welcomeTour.dummies.becomeCoach.precise"),
              },
              {
                icon: Rocket,
                label: t("welcomeTour.dummies.becomeCoach.growth"),
                val: t("welcomeTour.dummies.becomeCoach.fast"),
              },
              {
                icon: Award,
                label: t("welcomeTour.dummies.becomeCoach.tech"),
                val: t("welcomeTour.dummies.becomeCoach.modern"),
              },
            ].map((prop, i) => (
              <div
                key={i}
                className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center"
              >
                <prop.icon className="w-6 h-6 mb-2 opacity-80" />
                <span className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-60">
                  {prop.label}
                </span>
                <span className="text-sm font-black italic">{prop.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DummyPageWrapper>
  );
};

import { Activity, Calendar, Dumbbell, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyProgramCard = () => {
  const { t } = useTranslation();

  const Card = ({ secondary = false }: { secondary?: boolean }) => (
    <div
      className={`w-full max-w-sm bg-surface border rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
        secondary
          ? "border-border/20 opacity-40 scale-90 hidden md:block"
          : "border-border/50 shadow-primary/5 hover:scale-[1.02]"
      }`}
    >
      <div
        className={`h-2 ${
          secondary
            ? "bg-gradient-to-r from-gray-400 to-gray-500"
            : "bg-primary"
        }`}
      />
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
              secondary
                ? "bg-gray-200 text-gray-400Shadow"
                : "bg-primary shadow-blue-500/20 text-white"
            }`}
          >
            <Dumbbell className="w-8 h-8" />
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                secondary
                  ? "bg-gray-100 text-gray-400 border-gray-200"
                  : "bg-primary/10 text-primary border-primary/20"
              }`}
            >
              {secondary
                ? t("welcomeTour.dummies.programs.fullBody")
                : t("welcomeTour.dummies.programs.tag")}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-black text-text-primary mb-1">
            {secondary
              ? t("welcomeTour.dummies.programs.yogaFlow")
              : t("welcomeTour.dummies.programs.name")}
          </h4>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
            {secondary
              ? t("welcomeTour.dummies.programs.beginner")
              : t("welcomeTour.dummies.programs.level")}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: Calendar,
              label: t("welcomeTour.dummies.programs.days"),
              val: secondary ? "3" : "4",
            },
            {
              icon: Target,
              label: t("welcomeTour.dummies.programs.sessions"),
              val: secondary ? "12" : "16",
            },
            {
              icon: Activity,
              label: t("welcomeTour.dummies.programs.exercises"),
              val: secondary ? "30" : "48",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-background-secondary/50 rounded-2xl p-3 border border-border/40 text-center"
            >
              <stat.icon
                className={`w-4 h-4 mx-auto mb-2 ${
                  secondary ? "text-gray-400" : "text-primary"
                }`}
              />
              <span className="block text-sm font-black text-text-primary">
                {stat.val}
              </span>
              <span className="text-[8px] font-bold text-text-secondary uppercase">
                {stat.label.split(" ").pop()}
              </span>
            </div>
          ))}
        </div>

        {!secondary && (
          <div className="pt-2">
            <div className="w-full py-3 bg-primary rounded-2xl text-white text-center font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20">
              {t("training.programs.card.start")}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.programs.pageTitle")}
      locationKey="programs"
    >
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full justify-center px-2 md:px-0 pb-4">
        <Card />
        <Card secondary />
      </div>
    </DummyPageWrapper>
  );
};

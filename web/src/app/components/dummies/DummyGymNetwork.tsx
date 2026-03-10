import { MapPin, Shield, Star, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyGymNetwork = () => {
  const { t } = useTranslation();

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.coachGyms.pageTitle")}
      locationKey="coachGyms"
    >
      <div className="w-full h-full flex flex-col items-center justify-start max-w-4xl text-center px-4 pt-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-text-primary">
              {t("welcomeTour.dummies.coachGyms.title")}
            </h3>
            <p className="text-sm text-text-secondary">
              {t("welcomeTour.dummies.coachGyms.desc")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
          {[
            {
              icon: Shield,
              label: t("welcomeTour.dummies.coachGyms.active"),
              value: "3",
              color: "text-green-500",
              bg: "bg-green-500/10",
            },
            {
              icon: Star,
              label: t("welcomeTour.dummies.coachGyms.pending"),
              value: "1",
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              icon: Users,
              label: t("welcomeTour.dummies.coachGyms.totalStaff"),
              value: "24",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-surface/50 border border-border/40 rounded-2xl p-4 flex flex-col items-center gap-1 backdrop-blur-sm shadow-sm"
            >
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} mb-1`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-text-primary">
                {stat.value}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary opacity-60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full space-y-3">
          {[
            {
              name: t("welcomeTour.dummies.coachGyms.gym1.name"),
              access: t("welcomeTour.dummies.coachGyms.gym1.access"),
              color: "from-blue-500 to-indigo-600",
            },
            {
              name: t("welcomeTour.dummies.coachGyms.gym2.name"),
              access: t("welcomeTour.dummies.coachGyms.gym2.access"),
              color: "from-purple-500 to-pink-600",
            },
          ].map((gym, i) => (
            <div
              key={i}
              className="w-full bg-surface/50 border border-border/30 rounded-2xl p-4 flex items-center justify-between group hover:border-primary/30 transition-all cursor-default"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gym.color} flex items-center justify-center text-white shadow-lg`}
                >
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-start">
                  <h4 className="font-bold text-text-primary">{gym.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-text-secondary">
                      {gym.access}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tight">
                Verified
              </div>
            </div>
          ))}
        </div>
      </div>
    </DummyPageWrapper>
  );
};

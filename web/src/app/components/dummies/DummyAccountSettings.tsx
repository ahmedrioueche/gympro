import { Bell, CreditCard, ShieldCheck, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DummyPageWrapper } from "./DummyPageWrapper";

interface DummyAccountSettingsProps {
  title?: string;
  locationKey?: string;
}

export const DummyAccountSettings: React.FC<DummyAccountSettingsProps> = ({
  title,
  locationKey = "settings",
}) => {
  const { t } = useTranslation();

  return (
    <DummyPageWrapper
      pageTitle={title || t("welcomeTour.dummies.settings.pageTitle")}
      locationKey={locationKey}
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Sidebar Mock */}
        <div className="md:col-span-1 space-y-2">
          {[
            {
              icon: User,
              label: t("welcomeTour.dummies.settings.general"),
              active: true,
            },
            {
              icon: ShieldCheck,
              label: t("welcomeTour.dummies.settings.security"),
              active: false,
            },
            {
              icon: Bell,
              label: t("welcomeTour.dummies.settings.notifications"),
              active: false,
            },
            {
              icon: CreditCard,
              label: t("welcomeTour.dummies.settings.subscription"),
              active: false,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                item.active
                  ? "bg-primary/10 text-primary border border-primary/20 font-blackShadow"
                  : "text-text-secondary hover:bg-background-secondary/50 font-bold opacity-60"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Settings Content Mock */}
        <div className="md:col-span-3 bg-surface border border-border/40 rounded-[2rem] p-6 shadow-2xl space-y-6">
          <div className="flex items-center gap-4 border-b border-border/40 pb-6 mb-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              AT
            </div>
            <div>
              <h4 className="text-xl font-black text-text-primary leading-none mb-1">
                {t("welcomeTour.dummies.settings.name")}
              </h4>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                {t("welcomeTour.dummies.settings.since")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">
                {t("welcomeTour.dummies.settings.fullName")}
              </label>
              <div className="w-full p-4 bg-background-secondary/50 border border-border/40 rounded-2xl text-text-primary text-sm font-bold italic">
                {t("welcomeTour.dummies.settings.name")}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">
                {t("welcomeTour.dummies.settings.email")}
              </label>
              <div className="w-full p-4 bg-background-secondary/50 border border-border/40 rounded-2xl text-text-primary text-sm font-bold italic">
                {t("welcomeTour.dummies.settings.emailValue")}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button className="px-6 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/30">
              {t("welcomeTour.dummies.settings.save")}
            </button>
          </div>
        </div>
      </div>
    </DummyPageWrapper>
  );
};

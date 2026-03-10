import {
  Camera,
  Clock,
  Globe,
  MapPin,
  Save,
  Settings,
  Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyManagerSettings = () => {
  const { t } = useTranslation();

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.managerSettings.pageTitle")}
      locationKey="managerSettings"
    >
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 space-y-4">
            <div className="bg-surface border border-border/40 rounded-3xl p-6 shadow-lg text-center relative group">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary via-blue-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                  Gym
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-surface border border-border/40 rounded-2xl flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-all cursor-pointer">
                  <Camera className="w-5 h-5" />
                </div>
              </div>
              <h5 className="text-lg font-black text-text-primary italic">
                {t("welcomeTour.dummies.managerSettings.gymName")}
              </h5>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1 opacity-60">
                Premium Gym Management
              </p>
            </div>

            <nav className="bg-surface border border-border/40 rounded-3xl p-2 shadow-lg space-y-1">
              {[
                {
                  icon: Settings,
                  label: t("welcomeTour.dummies.managerSettings.profile"),
                  active: true,
                },
                {
                  icon: Clock,
                  label: t("welcomeTour.dummies.managerSettings.hours"),
                  active: false,
                },
                {
                  icon: Shield,
                  label: t("welcomeTour.dummies.managerSettings.facilities"),
                  active: false,
                },
                { icon: MapPin, label: "Locations", active: false },
                { icon: Globe, label: "Public Site", active: false },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                    item.active
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-text-secondary hover:bg-background-secondary"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex-1 space-y-6">
            <div className="bg-surface border border-border/40 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

              <h4 className="text-xl font-black text-text-primary mb-8 italic flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary" />
                {t("welcomeTour.dummies.managerSettings.title")}
              </h4>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60 ml-1">
                    Gym Name
                  </label>
                  <input
                    type="text"
                    defaultValue={t(
                      "welcomeTour.dummies.managerSettings.gymName",
                    )}
                    className="w-full px-5 py-4 bg-background-secondary border border-border/30 rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60 ml-1">
                      Operating Hours
                    </label>
                    <div className="px-5 py-4 bg-background-secondary border border-border/30 rounded-2xl text-xs font-bold text-text-secondary flex items-center justify-between shadow-inner">
                      <span>Mon - Fri: 06:00 - 22:00</span>
                      <Clock className="w-4 h-4 opacity-40" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60 ml-1">
                      Currency
                    </label>
                    <div className="px-5 py-4 bg-background-secondary border border-border/30 rounded-2xl text-xs font-bold text-text-secondary flex items-center justify-between shadow-inner">
                      <span>USD ($)</span>
                      <Globe className="w-4 h-4 opacity-40" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-primary text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transform transition-all active:scale-95">
                    <Save className="w-4 h-4" />
                    {t("welcomeTour.dummies.managerSettings.save")}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface/50 border border-dashed border-border/60 rounded-[2rem] p-6 text-center">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 leading-relaxed">
                Changes made here will be instantly reflected on your <br />
                <span className="text-primary cursor-pointer hover:underline">
                  public gym profile
                </span>{" "}
                and members apps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DummyPageWrapper>
  );
};

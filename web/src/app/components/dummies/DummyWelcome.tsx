import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language";
import { DummyPageWrapper } from "./DummyPageWrapper";

interface DummyWelcomeProps {
  title?: string;
  locationKey?: string;
}

export const DummyWelcome: React.FC<DummyWelcomeProps> = ({
  title,
  locationKey = "welcome",
}) => {
  const { t } = useTranslation();
  const { isRtl } = useLanguageStore();

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.welcome.pageTitle")}
      locationKey="welcome"
      hideHeader={true}
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-4xl text-center px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary via-secondary to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500 ring-4 ring-white/10">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-3 italic tracking-tight">
          {t("welcomeTour.dummies.welcome.title")}
        </h3>

        <p className="text-sm md:text-base text-text-secondary max-w-2xl leading-relaxed font-medium mb-6">
          {t("welcomeTour.dummies.welcome.desc")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6">
          {[
            {
              icon: Globe,
              label: t("welcomeTour.dummies.welcome.features.global"),
              color: "text-blue-500",
            },
            {
              icon: Heart,
              label: t("welcomeTour.dummies.welcome.features.premium"),
              color: "text-pink-500",
            },
            {
              icon: ShieldCheck,
              label: t("welcomeTour.dummies.welcome.features.security"),
              color: "text-green-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-surface/50 border border-border/40 rounded-xl p-4 flex flex-col items-center gap-2 backdrop-blur-sm shadow-lg hover:border-primary/30 transition-all group"
            >
              <item.icon
                className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`}
              />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest animate-bounce">
            {t("welcomeTour.dummies.welcome.scroll")}{" "}
            {isRtl ? (
              <ArrowLeft className="w-3 h-3" />
            ) : (
              <ArrowRight className="w-3 h-3" />
            )}
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-surface to-border flex items-center justify-center text-[8px] font-bold text-text-secondary"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[8px] font-black text-white">
              +2k
            </div>
          </div>
          <p className="text-xs font-bold text-text-secondary opacity-60 mt-2">
            {t("welcomeTour.dummies.welcome.trustedBy")}
          </p>
        </div>
      </div>
    </DummyPageWrapper>
  );
};

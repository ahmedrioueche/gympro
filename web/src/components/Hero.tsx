import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation();

  return (
    <div className=" hidden lg:flex lg:flex-1 relative overflow-hidden flex-col">
      {/* Background gradients and effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-1/3 right-32 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Content - flex-1 to take remaining space */}
      <div className="relative z-10 flex flex-col justify-center px-12 text-white flex-1 -mt-18">
        <h1 className="text-5xl max-w-lg font-bold mb-6 leading-tight">
          {t("auth.hero_title")}
        </h1>
        <p className="text-xl opacity-90 leading-relaxed max-w-md">
          {t("auth.hero_subtitle")}
        </p>

        {/* Feature List */}
        <ul className="mt-8 space-y-4">
          {[t("auth.feature_1"), t("auth.feature_2"), t("auth.feature_3")].map(
            (feature, i) => (
              <li key={i} className="flex items-center">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="opacity-90">{feature}</span>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default Hero;

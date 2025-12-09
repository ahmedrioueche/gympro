import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

function Hero() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Conditional colors for light/dark mode
  const backgroundGradient = isDark
    ? "from-gray-900 via-gray-800 to-gray-700"
    : "from-primary via-secondary to-accent";

  const overlayGradient = isDark
    ? "bg-gradient-to-t from-black/40 to-black/0"
    : "bg-gradient-to-t from-black/20 to-transparent";

  const animatedCircles = [
    {
      className: `absolute top-20 left-20 w-32 h-32 rounded-full blur-xl animate-pulse ${
        isDark ? "bg-purple-800/30" : "bg-white/10"
      }`,
    },
    {
      className: `absolute top-1/3 right-32 w-48 h-48 rounded-full blur-2xl animate-pulse ${
        isDark ? "bg-indigo-900/20" : "bg-white/5"
      }`,
      style: { animationDelay: "1s" },
    },
    {
      className: `absolute bottom-32 left-1/3 w-24 h-24 rounded-full blur-lg animate-pulse ${
        isDark ? "bg-pink-900/25" : "bg-white/15"
      }`,
      style: { animationDelay: "2s" },
    },
  ];

  return (
    <div className="hidden lg:flex lg:flex-1 relative overflow-hidden flex-col">
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient}`}
      ></div>

      {/* Overlay gradient */}
      <div className={`absolute inset-0 ${overlayGradient}`}></div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        {animatedCircles.map((circle, i) => (
          <div key={i} className={circle.className} style={circle.style}></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center px-12 text-white flex-1 -mt-18">
        <h1
          className={`text-5xl max-w-lg font-bold mb-6 leading-tight ${
            isDark ? "text-gray-100" : "text-white"
          }`}
        >
          {t("auth.hero_title")}
        </h1>
        <p
          className={`text-xl leading-relaxed max-w-md ${
            isDark ? "text-gray-300" : "text-white/90"
          }`}
        >
          {t("auth.hero_subtitle")}
        </p>

        {/* Feature list */}
        <ul className="mt-8 space-y-4">
          {[t("auth.feature_1"), t("auth.feature_2"), t("auth.feature_3")].map(
            (feature, i) => (
              <li key={i} className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    isDark ? "bg-gray-700/50" : "bg-white/20"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 ${
                      isDark ? "text-purple-300" : "text-white"
                    }`}
                  />
                </div>
                <span className={`${isDark ? "text-gray-300" : "opacity-90"}`}>
                  {feature}
                </span>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default Hero;

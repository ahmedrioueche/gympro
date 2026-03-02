import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

function Hero() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className="hidden lg:flex lg:flex-1 relative overflow-hidden flex-col">
      {/* Background base */}
      <div className="absolute inset-0 bg-[#101622]" />

      {/* Hero image — fades in with the same treatment as the landing page */}
      <img
        src="/images/home_hero_image.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 0,
          animation: "heroImageRevealAuth 1.8s ease-out 0.3s forwards",
          maskImage:
            "linear-gradient(to left, transparent 0%, black 20%, black 60%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to left, transparent 0%, black 20%, black 60%, transparent 95%)",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 50%, rgba(19,91,236,0.12) 0%, transparent 60%)",
          animation: "heroPulseGlow 4s ease-in-out infinite",
        }}
      />

      {/* Overlay gradient for text readability */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-r from-[#101622] via-[#101622]/70 to-transparent"
            : "bg-gradient-to-r from-black/60 via-black/30 to-transparent"
        }`}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center px-12 text-white flex-1 -mt-18">
        <h1
          className="hero-animate text-5xl max-w-lg font-bold mb-6 leading-tight text-gray-100"
          style={{ animation: "heroFadeUp 0.6s ease-out 0.2s forwards" }}
        >
          {t("auth.hero_title")}
        </h1>
        <p
          className="hero-animate text-xl leading-relaxed max-w-md text-gray-300"
          style={{ animation: "heroFadeUp 0.6s ease-out 0.4s forwards" }}
        >
          {t("auth.hero_subtitle")}
        </p>

        {/* Feature list */}
        <ul className="mt-8 space-y-4">
          {[t("auth.feature_1"), t("auth.feature_2"), t("auth.feature_3")].map(
            (feature, i) => (
              <li
                key={i}
                className="hero-animate flex items-center"
                style={{
                  animation: `heroFadeUp 0.6s ease-out ${0.6 + i * 0.15}s forwards`,
                }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-primary/20 border border-primary/30">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-gray-300">{feature}</span>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}

export default Hero;

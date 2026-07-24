import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center pt-20">
      {/* Background image — full bleed, fades left */}
      <div className="absolute inset-0 z-0">
        {/* Glow — pulses */}
        <div
          className="absolute right-0 top-1/2 w-[60%] h-[80%] bg-primary/10 blur-[120px] rounded-full"
          style={{
            animation: "heroPulseGlow 4s ease-in-out infinite",
          }}
        />

        {/* Image — fades in with subtle zoom */}
        <img
          src="/images/home_hero_image.png"
          alt="GymPro 3D visualization"
          className="absolute right-0 top-1/2 w-full md:w-[65%] h-full object-cover object-center"
          style={{
            opacity: 0,
            animation: "heroImageReveal 1.5s ease-out 0.2s forwards",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 30%, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 30%, black 80%, transparent 100%)",
          }}
        />

        {/* Mobile: extra bottom fade for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101622] via-transparent to-transparent md:hidden" />
      </div>

      {/* Text content — on top of the image */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 w-full ">
        <div className="max-w-xl lg:max-w-2xl">
          <div className="flex flex-col gap-1">
            {/* UNLEASH — delay 0.1s */}
            <h1
              className="hero-animate text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter text-outline leading-none"
              style={{ animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }}
            >
              {t("landing.hero.line1")}
            </h1>
            {/* THE POWER — delay 0.3s */}
            <h1
              className="hero-animate text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-primary leading-none"
              style={{ animation: "heroFadeUp 0.6s ease-out 0.3s forwards" }}
            >
              {t("landing.hero.line2")}
            </h1>
            {/* OF YOUR GYM — delay 0.5s */}
            <h1
              className="hero-animate text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight"
              style={{ animation: "heroFadeUp 0.6s ease-out 0.5s forwards" }}
            >
              {t("landing.hero.line3")}
            </h1>
          </div>
          {/* Description — delay 0.7s */}
          <p
            className="hero-animate mt-6 md:mt-8 text-slate-400 text-base md:text-lg max-w-lg font-light leading-relaxed"
            style={{ animation: "heroFadeUp 0.6s ease-out 0.7s forwards" }}
          >
            {t("landing.hero.description")}
          </p>
          {/* Buttons — delay 0.9s */}
          <div
            className="hero-animate mt-8 md:mt-12 flex flex-wrap gap-4 md:gap-6"
            style={{ animation: "heroFadeUp 0.6s ease-out 0.9s forwards" }}
          >
            <Link
              href={APP_PAGES.signUp.link}
              className="px-6 md:px-8 py-3 md:py-4 bg-primary text-white font-bold rounded-xl flex items-center gap-2 group shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <span>{t("landing.hero.getStarted")}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

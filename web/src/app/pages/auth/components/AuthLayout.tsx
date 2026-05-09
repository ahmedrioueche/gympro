import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../context/ThemeContext";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation();
  const { setMode } = useTheme();

  useEffect(() => {
    setMode("dark");
  }, []);

  const features = [
    t("auth.feature_1"),
    t("auth.feature_2"),
    t("auth.feature_3"),
  ];

  return (
    <div className="min-h-[100dvh] relative overflow-hidden bg-[#101622]">
      {/* Full-bleed background image — fades left into the form */}
      <img
        src="/images/home_hero_image.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 0,
          animation: "heroImageRevealAuth 1.8s ease-out 0.3s forwards",
          maskImage: "linear-gradient(to left, black 20%, transparent 65%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 20%, transparent 65%)",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(19,91,236,0.1) 0%, transparent 60%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 min-h-[100dvh] flex">
        {/* Left — Form */}
        <div className="flex-shrink-0 w-full lg:w-[55%] flex items-center">
          <div className="w-full max-w-2xl px-8 sm:px-14 lg:px-24 py-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

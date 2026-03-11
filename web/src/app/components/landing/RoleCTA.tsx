import { Link } from "@tanstack/react-router";
import React from "react";
import { APP_PAGES } from "../../../constants/navigation";
import { useInView } from "../../../hooks/useInView";

interface RoleCTAProps {
  title: React.ReactNode;
  description: string;
  buttonText: string;
  primaryColor: string;
  glowColor: string;
  badge?: string;
  accentColor?: string;
}

export default function RoleCTA({
  title,
  description,
  buttonText,
  primaryColor,
  glowColor,
  badge,
  accentColor,
}: RoleCTAProps) {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="px-6 md:px-10 text-center pb-20"
    >
      <div
        className="max-w-5xl mx-auto glass-card p-6 py-12 md:p-12 lg:p-20 rounded-[2.5rem] relative overflow-hidden hero-animate"
        style={{
          border: `1px solid ${primaryColor}30`,
          animation: inView ? "heroFadeUp 0.6s ease-out 0.1s forwards" : "none",
          opacity: inView ? 1 : 0,
        }}
      >
        {/* Background Decorative Glows */}
        <div
          className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 blur-3xl rounded-full opacity-20"
          style={{
            backgroundColor: primaryColor,
            animation: "heroPulseGlow 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 blur-3xl rounded-full opacity-10"
          style={{
            backgroundColor: accentColor || primaryColor,
            animation: "heroPulseGlow 4s ease-in-out infinite reverse",
          }}
        />

        <div className="relative z-10">
          {badge && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border text-xs font-bold uppercase tracking-widest"
              style={{
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}30`,
                color: primaryColor,
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: primaryColor }}
                ></span>
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: primaryColor }}
                ></span>
              </span>
              {badge}
            </div>
          )}

          <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight text-white tracking-tight">
            {title}
          </h2>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={APP_PAGES.signUp.link}
              className="px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-2xl"
              style={{
                backgroundColor: primaryColor,
                color: "#101f22",
                boxShadow: `0 20px 40px -10px ${glowColor}`,
              }}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

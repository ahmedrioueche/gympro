import type { LucideIcon } from "lucide-react";
import { useInView } from "../../../hooks/useInView";

interface RoleSectionProps {
  title: string;
  subtitle: string;
  features: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  visual: React.ReactNode;
  primaryColor: string; // e.g., "#4d97f2"
  secondaryColor: string; // e.g., "#7653e0"
  accentColor: string; // e.g., "#22d3ee"
  reversed?: boolean;
}

export default function RoleSection({
  title,
  subtitle,
  features,
  visual,
  primaryColor,
  secondaryColor,
  accentColor,
  reversed = false,
}: RoleSectionProps) {
  const { ref, inView } = useInView(0.2);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="max-w-7xl mx-auto w-full px-6 md:px-10 py-12 md:py-20 overflow-x-hidden"
    >
      <div
        className={`flex flex-col ${
          reversed ? "lg:flex-row-reverse" : "lg:flex-row"
        } items-center gap-12 lg:gap-20`}
      >
        {/* Content Side */}
        <div
          className="flex-1 space-y-8 hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.8s ease-out forwards" }
              : { opacity: 0 }
          }
        >
          <div className="space-y-4">
            <h2
              className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div
                  className="size-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${primaryColor}20`,
                    border: `1px solid ${primaryColor}40`,
                  }}
                >
                  <feature.icon
                    className="w-5 h-5"
                    style={{ color: primaryColor }}
                  />
                </div>
                <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Side */}
        <div
          className="flex-1 w-full flex justify-center items-center hero-animate"
          style={
            inView
              ? { animation: "heroFadeUp 0.8s ease-out 0.2s forwards" }
              : { opacity: 0 }
          }
        >
          <div className="relative w-full max-w-[500px] aspect-square">
            {/* Background Glow */}
            <div
              className="absolute inset-0 blur-[100px] opacity-20 rounded-full"
              style={{
                background: `radial-gradient(circle, ${primaryColor}, ${secondaryColor})`,
              }}
            />
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}

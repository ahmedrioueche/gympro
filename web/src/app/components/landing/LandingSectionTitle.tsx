import type { LucideIcon } from "lucide-react";

interface LandingSectionTitleProps {
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
  colorClassName?: string; // e.g. "text-primary", "text-purple-400"
  bgClassName?: string; // e.g. "bg-primary/10", "bg-purple-500/10"
  borderClassName?: string; // e.g. "border-primary/20", "border-purple-500/20"
  inView?: boolean;
}

export function LandingSectionTitle({
  title,
  subtitle,
  Icon,
  colorClassName = "text-primary",
  bgClassName = "bg-primary/10",
  borderClassName = "border-primary/20",
  inView = true,
}: LandingSectionTitleProps) {
  return (
    <div
      className="mb-8 md:mb-12 hero-animate"
      style={
        inView
          ? { animation: "heroFadeUp 0.6s ease-out 0.1s forwards" }
          : { opacity: 0 }
      }
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div
            className={`size-10 rounded-xl ${bgClassName} border ${borderClassName} flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-5 h-5 ${colorClassName}`} />
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-slate-400 max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

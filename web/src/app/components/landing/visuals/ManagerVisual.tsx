import { BarChart3, DollarSign, TrendingUp, Users } from "lucide-react";

interface ManagerVisualProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export default function ManagerVisual({
  primaryColor,
  secondaryColor,
  accentColor,
}: ManagerVisualProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central Chart Card */}
      <div className="relative z-10 w-4/5 aspect-video bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 group hover:border-white/20 transition-all duration-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="size-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <BarChart3 className="size-4" style={{ color: primaryColor }} />
            </div>
            <span className="text-sm font-bold text-white">Analytics</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="size-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400">+24%</span>
          </div>
        </div>

        {/* Animated Grid Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-px bg-white/20 absolute left-1/4" />
          <div className="h-full w-px bg-white/20 absolute left-2/4" />
          <div className="h-full w-px bg-white/20 absolute left-3/4" />
          <div className="w-full h-px bg-white/20 absolute top-1/3" />
          <div className="w-full h-px bg-white/20 absolute top-2/3" />
        </div>

        {/* Animated SVG Path */}
        <svg
          viewBox="0 0 400 200"
          className="w-full h-32 mt-4 overflow-visible"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          <path
            d="M0,150 Q50,140 100,100 T200,80 T300,40 T400,20"
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-draw-path"
            style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
          />
          {/* Pulsing Dots */}
          {[100, 200, 300, 400].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={i === 0 ? 100 : i === 1 ? 80 : i === 2 ? 40 : 20}
              r="4"
              fill={secondaryColor}
              className="animate-pulse"
            />
          ))}
        </svg>
      </div>

      {/* Floating Metric 1: Revenue */}
      <div
        className="absolute -top-4 -right-4 z-20 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg animate-float"
        style={{ animationDelay: "0s" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="size-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <DollarSign className="size-5" style={{ color: accentColor }} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">
              Monthly Revenue
            </p>
            <p className="text-sm font-bold text-white">$42,500</p>
          </div>
        </div>
      </div>

      {/* Floating Metric 2: Members */}
      <div
        className="absolute -bottom-8 -left-4 z-20 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg animate-float"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="size-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Users className="size-5" style={{ color: primaryColor }} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">
              Active Members
            </p>
            <p className="text-sm font-bold text-white">1,248</p>
          </div>
        </div>
      </div>

      {/* Background Particles/Glows */}
      <div
        className="absolute top-1/4 right-1/4 size-32 blur-3xl opacity-30 animate-pulse"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 size-32 blur-3xl opacity-30 animate-pulse"
        style={{ backgroundColor: secondaryColor, animationDelay: "1s" }}
      />
    </div>
  );
}

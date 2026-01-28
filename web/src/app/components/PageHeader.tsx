import type { LucideIcon } from "lucide-react";
import Button from "../../components/ui/Button";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle: string;
  actionButton?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    show?: boolean;
    loading?: boolean;
    disabled?: boolean;
  };
  gradientFrom?: string;
  gradientTo?: string;
}

// PageHeader Component
function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actionButton = null,
}: PageHeaderProps) {
  const ActionIcon = actionButton?.icon;
  const showBtn = actionButton?.show ?? true;

  return (
    <div className="relative mb-12 group">
      {/* Main container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800/95 to-slate-900 shadow-sm backdrop-blur-xl">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Accent gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Content */}
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                {/* Icon glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-md opacity-50"></div>
                {Icon && (
                  <Icon className="relative w-7 h-7 md:w-8 md:h-8 text-white" />
                )}
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-1">
                  {title}
                </h1>
                <p className="text-slate-400 text-sm md:text-base">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Right CTA */}
            {showBtn && ActionIcon && (
              <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                <Button
                  onClick={actionButton.onClick}
                  loading={actionButton.loading}
                  disabled={actionButton.disabled}
                  className="group/btn relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-[42px] text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-purple-500/15 overflow-hidden"
                >
                  <span className="relative z-10">{actionButton.label}</span>
                  <ActionIcon className="relative z-10 w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;

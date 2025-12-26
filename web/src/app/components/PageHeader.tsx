import type { LucideIcon } from "lucide-react";
import Button from "../../components/ui/Button";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  actionButton?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    show?: boolean;
  };
  gradientFrom?: string;
  gradientTo?: string;
}

function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actionButton,
  gradientFrom = "from-primary/10",
  gradientTo = "to-secondary/10",
}: PageHeaderProps) {
  const ActionIcon = actionButton?.icon;

  return (
    <div
      className={`relative mb-12 overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${gradientFrom} via-primary/5 ${gradientTo} p-6 md:p-8 shadow-sm`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md flex-shrink-0">
            <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-1">
              {title}
            </h1>
            <p className="text-text-secondary text-sm md:text-base">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right CTA */}
        {actionButton?.show && ActionIcon && (
          <Button
            onClick={actionButton.onClick}
            className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-[42px] text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {actionButton.label}
            <ActionIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default PageHeader;

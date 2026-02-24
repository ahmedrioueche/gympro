import { Zap, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color: string;
  bg: string;
  border: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-text-primary uppercase tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          {t("home.coach.quickActions.title", "Launchpad")}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`p-5 rounded-2xl ${action.bg} ${action.border} border bg-opacity-50 hover:bg-opacity-80 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center group relative overflow-hidden active:scale-95`}
          >
            <div className="absolute top-0 right-0 p-2 opacity-5 -mr-2 -mt-2 group-hover:scale-110 transition-transform">
              <action.icon size={48} />
            </div>

            <div
              className={`p-3 rounded-2xl bg-surface shadow-sm group-hover:shadow-md transition-all duration-300 ${action.color}`}
            >
              <action.icon className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-widest leading-tight ${action.color}`}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

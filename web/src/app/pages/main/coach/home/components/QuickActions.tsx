import { type LucideIcon } from "lucide-react";
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
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {t("home.coach.quickActions.title")}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`p-4 rounded-xl ${action.bg} ${action.border} border hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center group`}
          >
            <div className={`p-2 rounded-full bg-surface ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-medium ${action.color}`}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

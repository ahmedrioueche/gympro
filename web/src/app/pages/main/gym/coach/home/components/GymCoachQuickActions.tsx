import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Calendar,
  Clipboard,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../../constants/navigation";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color: string;
  bg: string;
  border?: string;
}

interface GymCoachQuickActionsProps {
  actions?: QuickAction[];
}

export default function GymCoachQuickActions({
  actions,
}: GymCoachQuickActionsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const defaultActions: QuickAction[] = [
    {
      label: t("home.coach.quickActions.createProgram", "Create Program"),
      icon: Clipboard,
      onClick: () => navigate({ to: APP_PAGES.coach.programs.link }),
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: t("home.coach.quickActions.addClient", "Add Client"),
      icon: UserPlus,
      onClick: () => navigate({ to: APP_PAGES.coach.clients.link }),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: t("home.coach.quickActions.scheduleSession", "Schedule Session"),
      icon: Calendar,
      onClick: () => navigate({ to: APP_PAGES.coach.schedule.link }),
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      label: t("home.coach.quickActions.viewAnalytics", "Analytics"),
      icon: BarChart3,
      onClick: () => navigate({ to: APP_PAGES.coach.analytics.link }),
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
  ];

  const displayActions = actions || defaultActions;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        {t("home.coach.quickActions.title", "Quick Actions")}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {displayActions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`p-4 rounded-xl border ${action.border} ${action.bg} hover:brightness-95 transition-all text-left group`}
          >
            <action.icon
              className={`w-6 h-6 ${action.color} mb-2 group-hover:scale-110 transition-transform`}
            />
            <span className={`text-sm font-medium ${action.color}`}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import {
  CreditCard,
  Dumbbell,
  FileText,
  Settings,
  Shield,
  UserPlus,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import GradientCard from "../../../../../components/ui/GradientCard";

const QuickActions: React.FC = () => {
  const { t } = useTranslation();

  const actions = [
    {
      label: "admin.home.quickActions.createEditor",
      icon: <UserPlus className="w-8 h-8" />,
      to: "/admin/staff",
      gradient: "from-blue-500 to-blue-600",
      bgHover: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      label: "admin.home.quickActions.reviewGyms",
      icon: <Dumbbell className="w-8 h-8" />,
      to: "/admin/gyms",
      gradient: "from-green-500 to-green-600",
      bgHover: "hover:from-green-600 hover:to-green-700",
    },
    {
      label: "admin.home.quickActions.systemSettings",
      icon: <Settings className="w-8 h-8" />,
      to: "/admin/settings",
      gradient: "from-slate-500 to-slate-600",
      bgHover: "hover:from-slate-600 hover:to-slate-700",
    },
    {
      label: "admin.home.stats.revenue",
      icon: <CreditCard className="w-8 h-8" />,
      to: "/admin/revenue",
      gradient: "from-amber-500 to-amber-600",
      bgHover: "hover:from-amber-600 hover:to-amber-700",
    },
    {
      label: "admin.reports",
      icon: <FileText className="w-8 h-8" />,
      to: "/admin/reports",
      gradient: "from-purple-500 to-purple-600",
      bgHover: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      label: "admin.alerts",
      icon: <Shield className="w-8 h-8" />,
      to: "/admin/alerts",
      gradient: "from-red-500 to-red-600",
      bgHover: "hover:from-red-600 hover:to-red-700",
    },
  ];

  return (
    <GradientCard>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        {t("admin.home.quickActions.title")}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            className={`bg-gradient-to-br ${action.gradient} ${action.bgHover} p-4 rounded-xl text-white font-semibold text-center hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-3 group`}
          >
            <span className="group-hover:scale-110 transition-transform duration-300">
              {action.icon}
            </span>
            <span className="text-sm leading-tight">{t(action.label)}</span>
          </Link>
        ))}
      </div>
    </GradientCard>
  );
};

export default QuickActions;

import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";

function QuickActions() {
  const { t } = useTranslation();

  const quickActions = [
    {
      icon: <PlusIcon className="w-10 h-10" />,
      label: t("home.manager.quickActions.createGym"),
      link: APP_PAGES.manager.createGym.link,
      gradient: "from-blue-500 to-blue-600",
      bgHover: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      icon: "👥",
      label: t("home.manager.quickActions.addStaff"),
      link: "#",
      gradient: "from-purple-500 to-purple-600",
      bgHover: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      icon: "📊",
      label: t("home.manager.quickActions.openAnalytics"),
      link: APP_PAGES.manager.analytics.link,
      gradient: "from-emerald-500 to-emerald-600",
      bgHover: "hover:from-emerald-600 hover:to-emerald-700",
    },
    {
      icon: "💳",
      label: t("home.manager.quickActions.manageSubscription"),
      link: APP_PAGES.manager.subscription.link,
      gradient: "from-amber-500 to-amber-600",
      bgHover: "hover:from-amber-600 hover:to-amber-700",
    },
    {
      icon: "⚙️",
      label: t("home.manager.quickActions.settings"),
      link: APP_PAGES.manager.settings.link,
      gradient: "from-slate-500 to-slate-600",
      bgHover: "hover:from-slate-600 hover:to-slate-700",
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden ">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {t("home.manager.quickActions.title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`bg-gradient-to-br ${action.gradient} ${action.bgHover} p-6 rounded-xl text-white font-semibold text-center hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-3 group`}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {action.icon}
              </span>
              <span className="text-sm leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuickActions;

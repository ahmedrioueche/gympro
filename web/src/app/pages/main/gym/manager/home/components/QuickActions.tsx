import { Link } from "@tanstack/react-router";
import { AlertCircle, PlusCircle, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../../constants/navigation";

export function QuickActions() {
  const { t } = useTranslation();

  const quickActions = [
    {
      icon: <PlusCircle className="w-8 h-8 md:w-10 md:h-10" />,
      label: t("home.gym.actions.enroll"),
      link: APP_PAGES.gym.manager.create_member.link,
      gradient: "from-blue-500 to-blue-600",
      bgHover: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      icon: <Users className="w-8 h-8 md:w-10 md:h-10" />,
      label: t("home.gym.actions.viewMembers"),
      link: APP_PAGES.gym.manager.members.link,
      gradient: "from-purple-500 to-purple-600",
      bgHover: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      icon: <AlertCircle className="w-8 h-8 md:w-10 md:h-10" />,
      label: t("home.gym.actions.report"),
      link: "#",
      gradient: "from-rose-500 to-rose-600",
      bgHover: "hover:from-rose-600 hover:to-rose-700",
    },
  ];

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm h-full">
        <h3 className="text-xl font-bold text-text-primary mb-6">
          {t("home.gym.actions.title")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.link}
              className={`bg-gradient-to-br ${action.gradient} ${action.bgHover} p-6 rounded-2xl text-white font-bold text-center hover:scale-[1.03] hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-4 group`}
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <span className="text-sm md:text-base">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

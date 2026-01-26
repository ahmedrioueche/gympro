import { useNavigate } from "@tanstack/react-router";
import { CreditCard, Dumbbell, MapPin, WalletCards } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";

export const MemberQuickActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: t("home.member.quickActions.findGyms"),
      description: t("home.member.quickActions.findGymsDesc"),
      icon: MapPin,
      path: APP_PAGES.member.gyms.link,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: t("home.member.quickActions.mySubscriptions"),
      description: t("home.member.quickActions.mySubscriptionsDesc"),
      icon: CreditCard,
      path: APP_PAGES.member.subscriptions.link,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: t("home.member.quickActions.attendance"),
      description: t("home.member.quickActions.attendanceDesc"),
      icon: WalletCards,
      path: APP_PAGES.member.attendance.link,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      title: t("home.member.quickActions.training"),
      description: t("home.member.quickActions.trainingDesc"),
      icon: Dumbbell,
      path: APP_PAGES.member.training.link,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {t("home.member.quickActions.title")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => navigate({ to: action.path })}
            className={`group relative p-6 rounded-2xl border ${action.border} ${action.bg} hover:shadow-lg transition-all duration-300 text-left`}
          >
            <div className="absolute inset-0 bg-surface opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-surface ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div
                className={`p-2 rounded-full bg-surface/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-2 -mt-2`}
              >
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface text-text-primary border border-border shadow-sm">
                  Go
                </span>
              </div>
            </div>
            <div>
              <h4 className={`text-lg font-bold mb-1 ${action.color}`}>
                {action.title}
              </h4>
              <p className="text-sm text-text-secondary">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

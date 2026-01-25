import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Calendar,
  CreditCard,
  Dumbbell,
  MapPin,
  Pencil,
  Timer,
  WalletCards,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/ui/Button";
import { APP_PAGES } from "../../../../../constants/navigation";
import { useMySubscription } from "../../../../../hooks/queries/useSubscription";
import { useUserStore } from "../../../../../store/user";
import ProfileHeader from "../../../../components/templates/profile-header/ProfileHeader";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { data: subscription } = useMySubscription();

  if (!user) return null;

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <ProfileHeader
        user={user}
        subscription={subscription}
        action={
          <Button
            onClick={() => navigate({ to: APP_PAGES.member.settings.link })}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-11 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
          >
            {t("home.member.profile.editProfile")}
            <Pencil className="w-4 h-4" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/30 transition-colors">
              <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xl font-bold text-text-primary">
                  {/* TODO: Connect to real stats */}1
                </span>
                <span className="text-xs text-text-secondary">
                  {t("home.member.stats.activeSubscriptions")}
                </span>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/30 transition-colors">
              <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xl font-bold text-text-primary">
                  {/* TODO: Connect to real stats */}
                  12
                </span>
                <span className="text-xs text-text-secondary">
                  {t("home.member.stats.checkIns")}
                </span>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/30 transition-colors">
              <div className="p-2 rounded-full bg-orange-500/10 text-orange-500">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xl font-bold text-text-primary">
                  {/* TODO: Connect to real stats */}
                  Tomorrow
                </span>
                <span className="text-xs text-text-secondary">
                  {t("home.member.stats.nextClass")}
                </span>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/30 transition-colors">
              <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xl font-bold text-text-primary">
                  {/* TODO: Connect to real stats */}3
                </span>
                <span className="text-xs text-text-secondary">
                  {t("home.member.stats.daysStreak")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Content */}

        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Grid */}
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
                    <div
                      className={`p-3 rounded-xl bg-surface ${action.color}`}
                    >
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

          {/* Placeholder for Recent Activity or Schedule */}
          {/* This can be populated with real data in future tasks */}
        </div>
      </div>
    </div>
  );
}

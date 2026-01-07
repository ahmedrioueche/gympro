import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Calendar,
  CreditCard,
  Dumbbell,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Timer,
  WalletCards,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import { useUserStore } from "../../../../../store/user";
import { formatDate } from "../../../../../utils/date";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUserStore();

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
      <div className="space-y-2">
        <h1 className="text-3xl text-center md:text-left font-bold text-text-primary">
          {t("home.member.welcome", {
            name: (user.profile.fullName || user.profile.username || "").split(
              " "
            )[0],
          })}
        </h1>
        <p className="text-text-secondary text-center md:text-left">
          {t("home.member.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-surface border-2 border-surface overflow-hidden flex items-center justify-center">
                  {user.profile.profileImageUrl ? (
                    <img
                      src={user.profile.profileImageUrl}
                      alt={user.profile.fullName || user.profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                      {(user.profile.fullName || user.profile.username || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-text-primary">
                  {user.profile.fullName || user.profile.username}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                  <Mail className="w-4 h-4" />
                  <span>{user.profile.email}</span>
                </div>
                {user.profile.phoneNumber && (
                  <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                    <Phone className="w-4 h-4" />
                    <span>{user.profile.phoneNumber}</span>
                  </div>
                )}
              </div>

              <div className="w-full pt-4 border-t border-border mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    {t("home.member.profile.memberSince")}
                  </span>
                  <span className="font-medium text-text-primary">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate({ to: APP_PAGES.member.settings.link })}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface-hover hover:bg-border/50 text-text-primary font-medium transition-all duration-200 border border-border hover:border-border/80"
              >
                <Pencil className="w-4 h-4" />
                {t("home.member.profile.editProfile")}
              </button>
            </div>
          </div>

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

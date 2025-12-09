import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import { useUserStore } from "../../../../../store/user";

function HomePage() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  // Mock data - will be replaced with real API data later
  const managerData = {
    name: user.profile.fullName || user.profile.username,
    subName: user.profile.fullName
      ? user.profile.username
      : user.profile.country,
    accountStatus: "Free trial",
  };

  const businessMetrics = {
    totalGyms: 2,
    activeMembers: 5,
    totalStaff: 6,
    monthlyRevenue: 660,
    outstandingPayments: 5,
    issues: 2,
  };

  const quickActions = [
    {
      icon: "➕",
      label: t("home.manager.quickActions.createGym"),
      link: APP_PAGES.manager.createGym.link,
      gradient: "from-primary to-accent",
    },
    {
      icon: "👥",
      label: t("home.manager.quickActions.addStaff"),
      link: "#",
      gradient: "from-secondary to-primary",
    },
    {
      icon: "📊",
      label: t("home.manager.quickActions.openAnalytics"),
      link: "#",
      gradient: "from-accent to-success",
    },
    {
      icon: "💳",
      label: t("home.manager.quickActions.manageSubscription"),
      link: "#",
      gradient: "from-warning to-danger",
    },
    {
      icon: "⚙️",
      label: t("home.manager.quickActions.businessSettings"),
      link: "#",
      gradient: "from-primary to-secondary",
    },
  ];

  const alerts = [
    {
      type: "paymentIssue",
      message: "3 members have failed payment attempts",
      time: "2 hours ago",
      severity: "high",
    },
    {
      type: "contractExpiring",
      message: "2 staff contracts expiring this month",
      time: "5 hours ago",
      severity: "medium",
    },
    {
      type: "maintenance",
      message: "Equipment maintenance due at Downtown Gym",
      time: "1 day ago",
      severity: "low",
    },
  ];

  const lastVisitedGym = {
    name: "Downtown Fitness Center",
    activeMembers: 456,
    todayCheckIns: 89,
    revenueTrend: "+12%",
    trendPositive: true,
  };

  return (
    <div className="min-h-screen  p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Manager Profile Overview */}
        <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
                {managerData.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                  {managerData.name}
                </h1>
                <p className="text-text-secondary text-sm md:text-base">
                  {managerData.subName}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-xl px-4 py-3">
                <p className="text-xs text-text-secondary mb-1">
                  {t("home.manager.profile.accountStatus")}
                </p>
                <p className="text-sm font-semibold text-success">
                  {t(
                    `home.manager.profile.status.${managerData.accountStatus}`
                  )}
                </p>
              </div>

              <Link
                to="#"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
              >
                <span>✏️</span>
                {t("home.manager.profile.editProfile")}
              </Link>
            </div>
          </div>
        </div>

        {/* Business Overview */}
        <div className=" bg-gradient-to-r from-surface via-surface to-primary/5 border border-border rounded-2xl p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-1">
              {t("home.manager.businessOverview.title")}
            </h2>
            <p className="text-text-secondary">
              {t("home.manager.businessOverview.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Total Gyms */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-2xl">
                  🏢
                </div>
                <span className="text-3xl font-bold text-primary">
                  {businessMetrics.totalGyms}
                </span>
              </div>
              <p className="text-text-secondary text-sm font-medium">
                {t("home.manager.businessOverview.totalGyms")}
              </p>
            </div>

            {/* Active Members */}
            <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-6 hover:shadow-lg hover:shadow-success/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center text-2xl">
                  👥
                </div>
                <span className="text-3xl font-bold text-success">
                  {businessMetrics.activeMembers.toLocaleString()}
                </span>
              </div>
              <p className="text-text-secondary text-sm font-medium">
                {t("home.manager.businessOverview.activeMembers")}
              </p>
            </div>

            {/* Total Staff */}
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl p-6 hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center text-2xl">
                  👔
                </div>
                <span className="text-3xl font-bold text-secondary">
                  {businessMetrics.totalStaff}
                </span>
              </div>
              <p className="text-text-secondary text-sm font-medium">
                {t("home.manager.businessOverview.totalStaff")}
              </p>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-6 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-2xl">
                  💰
                </div>
                <span className="text-3xl font-bold text-accent">
                  ${businessMetrics.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <p className="text-text-secondary text-sm font-medium">
                {t("home.manager.businessOverview.monthlyRevenue")}
              </p>
            </div>

            {/* Outstanding Payments */}
            <div className="bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl p-6 hover:shadow-lg hover:shadow-warning/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <span className="text-3xl font-bold text-warning">
                  {businessMetrics.outstandingPayments}
                </span>
              </div>
              <p className="text-text-secondary text-sm font-medium">
                {t("home.manager.businessOverview.outstandingPayments")}
              </p>
            </div>

            {/* Issues */}
            <div className="bg-gradient-to-br from-danger/10 to-danger/5 border border-danger/20 rounded-xl p-6 hover:shadow-lg hover:shadow-danger/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-danger/20 flex items-center justify-center text-2xl">
                  🚨
                </div>
                <span className="text-3xl font-bold text-danger">
                  {businessMetrics.issues}
                </span>
              </div>
              <p className="text-text-secondary text-sm font-medium">
                {t("home.manager.businessOverview.issues")}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className=" bg-gradient-to-r from-surface via-surface to-primary/5 border border-border rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            {t("home.manager.quickActions.title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`bg-gradient-to-br ${action.gradient} p-6 rounded-xl text-white font-semibold text-center hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-3 group`}
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </span>
                <span className="text-sm leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Alerts & Gym Overview - Side by Side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts & Notifications */}
          <div className=" bg-gradient-to-r from-surface via-surface to-primary/5 border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {t("home.manager.alerts.title")}
              </h2>
              <Link
                to="#"
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                {t("home.manager.alerts.viewAll")} →
              </Link>
            </div>

            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`border-l-4 ${
                    alert.severity === "high"
                      ? "border-danger bg-danger/5"
                      : alert.severity === "medium"
                      ? "border-warning bg-warning/5"
                      : "border-primary bg-primary/5"
                  } p-4 rounded-r-lg hover:shadow-md transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                        {alert.message}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {alert.time}
                      </p>
                    </div>
                    <span
                      className={`text-2xl ${
                        alert.severity === "high" ? "animate-pulse" : ""
                      }`}
                    >
                      {alert.severity === "high"
                        ? "🔴"
                        : alert.severity === "medium"
                        ? "🟡"
                        : "🔵"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Last Visited Gym */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              {t("home.manager.gymOverview.title")}
            </h2>

            <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                {lastVisitedGym.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary mb-1">
                    {lastVisitedGym.activeMembers}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {t("home.manager.gymOverview.activeMembers")}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-success mb-1">
                    {lastVisitedGym.todayCheckIns}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {t("home.manager.gymOverview.todayCheckIns")}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4 text-center">
                  <p
                    className={`text-3xl font-bold mb-1 ${
                      lastVisitedGym.trendPositive
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {lastVisitedGym.revenueTrend}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {t("home.manager.gymOverview.revenueTrend")}
                  </p>
                </div>
              </div>

              <Link
                to={APP_PAGES.manager.gyms.link}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t("home.manager.gymOverview.viewDetails")} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

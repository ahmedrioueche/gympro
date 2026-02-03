import { Home } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../components/ui/Loading";
import PageHeader from "../../../components/PageHeader";
import AdminStatsGrid from "./components/AdminStatsGrid";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";
import { useAdminStats } from "./hooks/useAdminStats";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading)
    return (
      <>
        <PageHeader
          title={t("admin.home.title")}
          subtitle={t("admin.home.subtitle")}
          icon={Home}
        />
        <Loading />;
      </>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("admin.home.title")}
        subtitle={t("admin.home.subtitle")}
        icon={Home}
      />

      {stats && <AdminStatsGrid stats={stats} />}

      <QuickActions />

      <RecentActivity
        users={stats?.recentUsers || []}
        gyms={stats?.recentGyms || []}
      />
    </div>
  );
};

export default HomePage;

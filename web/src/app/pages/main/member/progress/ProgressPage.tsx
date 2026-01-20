import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import PageHeader from "../../../../components/PageHeader";
import { ActivityCalendar } from "./components/ActivityCalendar";
import { RecentWorkouts } from "./components/RecentWorkouts";
import { StatsOverview } from "./components/StatsOverview";
import { useProgressHistory, useProgressStats } from "./hooks/useProgress";

export const ProgressPage = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = useProgressStats();
  const { data: history, isLoading: historyLoading } = useProgressHistory();

  if (statsLoading || historyLoading) {
    return (
      <>
        <PageHeader
          title={t("progress.title")}
          subtitle={t("progress.subtitle")}
          icon={TrendingUp}
        />
        <Loading />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("progress.title")}
        subtitle={t("progress.subtitle")}
        icon={TrendingUp}
      />

      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCalendar history={history} />
        <RecentWorkouts history={history} />
      </div>
    </div>
  );
};

export default ProgressPage;

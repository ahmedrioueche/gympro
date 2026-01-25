import { useNavigate } from "@tanstack/react-router";
import { BarChart3, PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../components/ui/NoData";

export default function AnalyticsEmptyState() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <NoData
      icon={BarChart3}
      title={t("analytics.empty.title", "Insights Are Warming Up")}
      description={t(
        "analytics.empty.desc",
        "Once you have active gyms and member activity, we'll start visualizing your business performance here.",
      )}
      actionButton={{
        label: t("analytics.empty.action", "Manage My Gyms"),
        icon: PlusCircle,
        onClick: () => navigate({ to: "/manager/gyms" }),
      }}
    />
  );
}

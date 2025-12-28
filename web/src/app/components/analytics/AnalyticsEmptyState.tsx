import { useNavigate } from "@tanstack/react-router";
import { BarChart3, PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../components/ui/Button";

export default function AnalyticsEmptyState() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface border border-border border-dashed rounded-3xl">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <BarChart3 className="w-10 h-10 text-primary" />
      </div>

      <h3 className="text-2xl font-bold text-text-primary mb-3">
        {t("analytics.empty.title", "Insights Are Warming Up")}
      </h3>

      <p className="text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
        {t(
          "analytics.empty.desc",
          "Once you have active gyms and member activity, we'll start visualizing your business performance here."
        )}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="filled"
          color="primary"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={() => navigate({ to: "/manager/gyms" })}
        >
          {t("analytics.empty.action", "Manage My Gyms")}
        </Button>
      </div>
    </div>
  );
}

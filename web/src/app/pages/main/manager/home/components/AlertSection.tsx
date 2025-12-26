import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

interface Alert {
  type: string;
  message: string;
  time: string;
  severity: "high" | "medium" | "low";
}

interface AlertsSectionProps {
  alerts: Alert[];
}

function AlertsSection({ alerts }: AlertsSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r min-h-full from-primary/5 to-secondary/5  p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("home.manager.alerts.title")}
          </h2>
          <Link
            to="#"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          >
            {t("home.manager.alerts.viewAll")} →
          </Link>
        </div>

        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`border-l-4 ${
                  alert.severity === "high"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : alert.severity === "medium"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                } p-4 rounded-r-lg hover:shadow-md transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {alert.message}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
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
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-3xl">
              ✅
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {t("home.manager.alerts.noAlertsTitle")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t("home.manager.alerts.noAlertsDescription")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertsSection;

import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";

export default function PendingCheckIns() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {t("home.coach.pendingCheckIns.title")}
      </h3>
      <div className="space-y-3">
        {/* TODO: Replace with real data */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {t("home.coach.pendingCheckIns.awaiting")}
              </p>
              <p className="text-xs text-text-secondary">
                {t("home.coach.pendingCheckIns.description")}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: APP_PAGES.coach.clients.link })}
            className="px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition-colors text-sm font-medium"
          >
            {t("home.coach.pendingCheckIns.review")}
          </button>
        </div>
      </div>
    </div>
  );
}

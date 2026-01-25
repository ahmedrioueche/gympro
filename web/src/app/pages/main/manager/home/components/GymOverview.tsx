import type { Gym } from "@ahmedrioueche/gympro-client";
import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/ui/Button";
import { APP_PAGES } from "../../../../../../constants/navigation";

import GradientCard from "../../../../../../components/ui/GradientCard";

interface GymOverviewProps {
  gyms: Gym[];
  lastVisitedGymId?: string;
  onGymAccessed: (gym: Gym) => void;
}

function GymOverview({
  gyms,
  lastVisitedGymId,
  onGymAccessed,
}: GymOverviewProps) {
  const { t } = useTranslation();

  return (
    <GradientCard className="h-full">
      <h2 className="text-2xl font-bold text-text-primary mb-6">
        {t("home.manager.gymOverview.title")}
      </h2>

      {gyms.length > 0 ? (
        <div className="space-y-4">
          {gyms.slice(0, 2).map((gym) => {
            const isLastVisited = gym._id === lastVisitedGymId;
            const stats = gym.memberStats || {
              withActiveSubscriptions: 0,
              checkedIn: 0,
              withExpiredSubscriptions: 0,
            };

            return (
              <div
                key={gym._id}
                className={`group relative bg-surface-hover border ${
                  isLastVisited
                    ? "border-primary/50 ring-1 ring-primary/20"
                    : "border-border"
                } rounded-xl p-6 hover:shadow-xl transition-all duration-300`}
              >
                {isLastVisited && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                    {t("home.manager.gymOverview.lastVisited")}
                  </span>
                )}

                <h3 className="text-xl font-bold text-text-primary mb-6">
                  {gym.name}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/30 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-primary mb-1">
                      {stats.withActiveSubscriptions}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {t("home.manager.gymOverview.activeMembers")}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-success/10 to-success/20 border border-success/30 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-success mb-1">
                      {stats.checkedIn}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {t("home.manager.gymOverview.todayCheckIns")}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-warning/10 to-warning/20 border border-warning/30 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-warning mb-1">
                      {stats.withExpiredSubscriptions}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {t("home.manager.gymOverview.expiredMembers", "Expired")}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => onGymAccessed(gym)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {t("home.manager.gymOverview.viewDetails")} →
                </Button>
              </div>
            );
          })}

          {gyms.length > 2 && (
            <div className="flex justify-center pt-2">
              <Link
                to={APP_PAGES.manager.gyms.link}
                className="text-primary font-semibold hover:underline transition-all"
              >
                {t("home.manager.gymOverview.viewMore", "View more gyms")}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-hover border border-border flex items-center justify-center text-3xl">
            🏢
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {t("home.manager.gymOverview.noGymTitle")}
          </h3>
          <p className="text-text-secondary mb-6">
            {t("home.manager.gymOverview.noGymDescription")}
          </p>
          <Link
            to={APP_PAGES.manager.createGym.link}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
            {t("home.manager.gymOverview.createGym")}
          </Link>
        </div>
      )}
    </GradientCard>
  );
}

export default GymOverview;

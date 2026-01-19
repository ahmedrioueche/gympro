import { GYM_PERMISSIONS } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";
import { useGymAnalytics } from "../../../../../../hooks/queries/useAnalytics";
import { usePermissions } from "../../../../../../hooks/usePermissions";
import { useGymStore } from "../../../../../../store/gym";
import GymHeroSection from "../../../../../components/gym/GymHeroSection";
import OperatingHours from "../../../../../components/gym/OperatingHours";
import { useGymMemberHome } from "../../member/home/hooks/useGymMemberHome";
import { GenderSplit } from "./components/GenderSplit";
import { PerformanceStats } from "./components/PerformanceStats";
import { QuickActions } from "./components/QuickActions";

export default function HomePage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { hasPermission } = usePermissions();
  const canViewAnalytics = hasPermission(GYM_PERMISSIONS.analytics.view);
  const canManageSettings = hasPermission(GYM_PERMISSIONS.settings.manage);

  const { data: analytics, isLoading } = useGymAnalytics(
    canViewAnalytics ? currentGym?._id || "" : ""
  );
  const navigate = useNavigate();
  const status = useGymMemberHome(currentGym?.settings);

  if (!currentGym) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8">
        <GymHeroSection
          gym={currentGym}
          status={status}
          action={
            canManageSettings
              ? {
                  label: t("home.gym.profile.editGym"),
                  onClick: () => {
                    navigate({ to: APP_PAGES.gym.manager.settings.link });
                  },
                  icon: Settings,
                }
              : undefined
          }
        />

        {/* Performance Stats */}
        {canViewAnalytics && (
          <PerformanceStats analytics={analytics} isLoading={isLoading} />
        )}

        {/* Quick Actions & Gender Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <QuickActions />
          <GenderSplit analytics={analytics} />
        </div>

        {/* Operating Hours */}
        <div className="grid grid-cols-1 gap-8">
          <OperatingHours settings={currentGym.settings} />
        </div>
      </div>
    </div>
  );
}

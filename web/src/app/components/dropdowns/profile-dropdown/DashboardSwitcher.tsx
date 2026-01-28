import type { DashboardType } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import {
  DropdownDivider,
  DropdownItem,
} from "../../../../components/ui/Dropdown";
import { DASHBOARD_CONFIG } from "./profileConstants";

interface DashboardSwitcherProps {
  availableDashboards: DashboardType[];
  activeDashboard: DashboardType;
  onSwitch: (dashboard: DashboardType) => void;
}

export function DashboardSwitcher({
  availableDashboards,
  activeDashboard,
  onSwitch,
}: DashboardSwitcherProps) {
  const { t } = useTranslation();

  if (availableDashboards.length <= 1) {
    return null;
  }

  return (
    <>
      <div className="px-4 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
        {t("dashboard.switchDashboard", "Switch Dashboard")}
      </div>
      {availableDashboards.map((dashboard) => {
        const config = DASHBOARD_CONFIG[dashboard];
        const isActive = dashboard === activeDashboard;

        return (
          <DropdownItem
            key={dashboard}
            icon={config.emoji}
            label={t(config.label)}
            onClick={() => onSwitch(dashboard)}
            className={isActive ? "bg-primary/10" : ""}
          />
        );
      })}
      <DropdownDivider />
    </>
  );
}

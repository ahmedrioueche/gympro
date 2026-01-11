import type { DashboardType } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  Check,
  ChevronDown,
  Dumbbell,
  GraduationCap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../constants/navigation";
import { useUserStore } from "../../store/user";

const DASHBOARD_CONFIG: Record<
  DashboardType,
  { icon: typeof Dumbbell; color: string; label: string }
> = {
  member: {
    icon: Dumbbell,
    color: "text-primary",
    label: "dashboard.member",
  },
  coach: {
    icon: GraduationCap,
    color: "text-success",
    label: "dashboard.coach",
  },
  manager: {
    icon: Briefcase,
    color: "text-warning",
    label: "dashboard.manager",
  },
};

interface DashboardSwitcherProps {
  className?: string;
}

export default function DashboardSwitcher({
  className = "",
}: DashboardSwitcherProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, activeDashboard, setActiveDashboard, canAccessDashboard } =
    useUserStore();

  // Get available dashboards
  const availableDashboards = (user?.dashboardAccess || [
    "member",
  ]) as DashboardType[];

  // Don't show switcher if only one dashboard available
  if (availableDashboards.length <= 1) {
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleDashboardChange = (dashboard: DashboardType) => {
    if (!canAccessDashboard(dashboard)) return;

    setActiveDashboard(dashboard);
    setIsOpen(false);

    // Navigate to dashboard home
    switch (dashboard) {
      case "manager":
        navigate({ to: APP_PAGES.manager.home.link });
        break;
      case "coach":
        navigate({ to: APP_PAGES.coach.link });
        break;
      case "member":
      default:
        navigate({ to: APP_PAGES.member.home.link });
        break;
    }
  };

  const currentConfig = DASHBOARD_CONFIG[activeDashboard];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-hover hover:bg-surface-hover/80 transition-all duration-200 border border-border"
      >
        <CurrentIcon className={`w-4 h-4 ${currentConfig.color}`} />
        <span className="text-sm font-medium text-text-primary">
          {t(currentConfig.label)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="py-1">
            {availableDashboards.map((dashboard) => {
              const config = DASHBOARD_CONFIG[dashboard];
              const Icon = config.icon;
              const isActive = dashboard === activeDashboard;

              return (
                <button
                  key={dashboard}
                  onClick={() => handleDashboardChange(dashboard)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                    isActive ? "bg-primary/10" : "hover:bg-surface-hover"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  <span
                    className={`flex-1 text-left text-sm font-medium ${
                      isActive ? "text-primary" : "text-text-primary"
                    }`}
                  >
                    {t(config.label)}
                  </span>
                  {isActive && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

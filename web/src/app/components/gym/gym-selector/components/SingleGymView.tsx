import type { UserRole } from "@ahmedrioueche/gympro-client";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Dumbbell, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import useScreen from "../../../../../hooks/useScreen";
import { useGymStore } from "../../../../../store/gym";
import { useUserStore } from "../../../../../store/user";
import { redirectToHomePageAfterTimeout } from "../../../../../utils/helper";
import RoleBadge from "../../RoleBadge";
import { useGymRole } from "../hooks/useGymRole";

interface SingleGymViewProps {
  gym: any;
  isSelected: boolean;
  onGymChange: (gymId: string) => void;
}

export default function SingleGymView({
  gym,
  isSelected,
  onGymChange,
}: SingleGymViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { user } = useUserStore();
  const { clearGym } = useGymStore();
  const { isMobile } = useScreen();
  const userRole = useGymRole(gym);

  const isOnGymDashboard = routerState.location.pathname.startsWith("/gym");

  const handleAction = () => {
    if (isOnGymDashboard) {
      // Clear gym before navigating back to account dashboard
      clearGym();
      redirectToHomePageAfterTimeout(user.role as UserRole, 0, navigate);
    } else {
      onGymChange(gym._id);
    }
  };

  return (
    <button
      onClick={handleAction}
      title={
        isOnGymDashboard
          ? t("gym.backToDashboard", "Back to Dashboard")
          : t("gym.accessGym", {
              name: gym.name,
              defaultValue: `Access ${gym.name}`,
            })
      }
      className={`group flex items-center gap-3 px-2 py-2 rounded-2xl transition-all duration-300 hover:bg-surface-hover/40 ${
        isMobile ? "scale-90 -ml-2" : ""
      }`}
    >
      {/* Left Icon: Changes based on location */}
      <div className="relative flex-shrink-0">
        <div
          className={`${
            isMobile ? "w-11 h-11" : "w-14 h-14"
          } rounded-2xl ${"bg-gradient-to-br from-primary via-primary to-secondary"} flex items-center justify-center shadow-xl shadow-primary/20 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/30 group-hover:scale-105 group-hover:-rotate-3`}
        >
          {isOnGymDashboard ? (
            gym.logoUrl ? (
              <img
                src={gym.logoUrl}
                alt={gym.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <Dumbbell
                className={`${
                  isMobile ? "w-6 h-6" : "w-7 h-7"
                } text-white drop-shadow-lg`}
              />
            )
          ) : (
            <Home
              className={`${
                isMobile ? "w-6 h-6" : "w-7 h-7"
              } text-white drop-shadow-lg`}
            />
          )}
        </div>
      </div>

      {/* Gym Name with truncation */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2">
          <div
            className={`${
              isMobile ? "text-base max-w-[140px]" : "text-xl max-w-[280px]"
            } font-bold text-text-primary truncate leading-tight tracking-tight`}
          >
            {gym.name}
          </div>
          {!isOnGymDashboard && (
            <span className="text-primary flex-shrink-0">→</span>
          )}
        </div>
        {!isMobile && (
          <div className="flex items-center gap-1.5 text-sm text-text-secondary/70 mt-1 font-medium">
            {userRole && <RoleBadge role={userRole} size="sm" />}
          </div>
        )}
      </div>

      {/* Right Icon: Changes based on location */}
      <div
        className={`${
          isMobile ? "w-8 h-8" : "w-10 h-10"
        } rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:scale-110`}
      >
        {isOnGymDashboard ? (
          <Home
            className={`${
              isMobile ? "w-4 h-4" : "w-5 h-5"
            } text-primary group-hover:text-white transition-colors`}
          />
        ) : (
          <Dumbbell
            className={`${
              isMobile ? "w-4 h-4" : "w-5 h-5"
            } text-primary group-hover:text-white transition-colors`}
          />
        )}
      </div>
    </button>
  );
}

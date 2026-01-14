import type { Gym, UserRole } from "@ahmedrioueche/gympro-client";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Building2, Home, Plus, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import useScreen from "../../../../../hooks/useScreen";
import { useGymStore } from "../../../../../store/gym";
import { useUserStore } from "../../../../../store/user";
import { redirectToHomePageAfterTimeout } from "../../../../../utils/helper";
import GymListItem from "./GymListItem";

interface GymSelectorDropdownProps {
  gyms: Gym[];
  selectedGym?: Gym;
  onGymSelect: (gymId: string) => void;
  onClose: () => void;
  showAllGymsOption: boolean;
}

export default function GymSelectorDropdown({
  gyms,
  selectedGym,
  onGymSelect,
  onClose,
  showAllGymsOption,
}: GymSelectorDropdownProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { user } = useUserStore();
  const { clearGym } = useGymStore();
  const { isMobile } = useScreen();

  const isOnGymDashboard = routerState.location.pathname.startsWith("/gym");

  return (
    <div
      className={`absolute ${
        isMobile
          ? "top-full left-0 right-0 mt-2"
          : "top-full left-0 mt-3 w-[420px]"
      } bg-background/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden z-50 border border-white/10 dark:border-white/5`}
      style={{
        animation: "dropdown-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>

      <div
        className={`relative max-h-[70vh] ${
          isMobile ? "max-h-[50vh]" : "max-h-[600px]"
        } overflow-y-auto scrollbar-thin pb-4 scrollbar-thumb-primary/20 scrollbar-track-transparent`}
      >
        {gyms.length > 0 ? (
          <div className="p-3 space-y-2">
            <div className="px-3 py-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                {t("gym.yourGyms", "Your Gyms")}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
              {isOnGymDashboard && (
                <div
                  onClick={() => {
                    // Important: Clear gym FIRST, synchronously
                    clearGym();

                    // Close dropdown
                    onClose();

                    // Then navigate (with no timeout for immediate effect)
                    redirectToHomePageAfterTimeout(
                      user.role as UserRole,
                      0,
                      navigate
                    );
                  }}
                  className="group flex flex-row space-x-2 cursor-pointer"
                >
                  <Home className="w-4 h-4 mt-0.5 text-text-secondary transition-colors duration-300 group-hover:text-primary" />
                  <span className="text-sm text-text-secondary transition-colors duration-300 group-hover:text-text-primary">
                    {t("gym.backToDashboard", "Back to Dashboard")}
                  </span>
                </div>
              )}
            </div>

            {gyms.map((gym) => (
              <GymListItem
                key={gym._id}
                gym={gym}
                isSelected={selectedGym?._id === gym._id}
                onSelect={onGymSelect}
              />
            ))}
          </div>
        ) : (
          <div className="px-8 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-gray-800/50 dark:to-gray-700/50 flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <p className="text-base font-bold text-text-primary mb-2">
              {t("gym.noGyms", "No gyms yet")}
            </p>
            <p className="text-sm text-text-secondary/70 font-medium">
              {t("gym.createFirst", "Create your first gym to get started")}
            </p>
          </div>
        )}
      </div>

      {showAllGymsOption && user.role !== "member" && (
        <div className="relative border-t border-white/5 p-3 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
          <button
            onClick={() => {
              onClose();
              navigate({ to: APP_PAGES.manager.createGym.link });
            }}
            className={`w-full flex items-center justify-center gap-2.5 ${
              isMobile ? "px-4 py-3" : "px-5 py-3.5"
            } rounded-2xl bg-gradient-to-r from-success/15 via-success/10 to-success/15 hover:from-success/25 hover:via-success/20 hover:to-success/25 border-2 border-success/30 hover:border-success/50 text-success font-bold transition-all duration-300 group shadow-lg shadow-success/10 hover:shadow-xl hover:shadow-success/20 hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
              <Plus className="w-4 h-4" strokeWidth={3} />
            </div>
            <span className={`${isMobile ? "text-sm" : "text-base"}`}>
              {t("gym.createNew", "Create New Gym")}
            </span>
          </button>
        </div>
      )}

      <style>{`
        @keyframes dropdown-appear {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

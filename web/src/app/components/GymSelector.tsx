import type { Gym, UserRole } from "@ahmedrioueche/gympro-client";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Building2,
  Check,
  ChevronDown,
  Dumbbell,
  Home,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../constants/navigation";
import useScreen from "../../hooks/useScreen";
import { useGymStore } from "../../store/gym";
import { useUserStore } from "../../store/user";
import { redirectToHomePageAfterTimeout } from "../../utils/helper";

interface GymSelectorProps {
  gyms?: Gym[];
  showAllGymsOption?: boolean;
  className?: string;
}

export default function GymSelector({
  gyms = [],
  showAllGymsOption = true,
  className = "",
}: GymSelectorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const { currentGym, setGym } = useGymStore();
  const { isMobile } = useScreen();

  const isOnGymDashboard = routerState.location.pathname.startsWith("/gym");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
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

  const handleGymChange = (gymId: string | null) => {
    setIsOpen(false);
    const selected = gyms.find((g) => g._id === gymId) || null;
    setGym(selected);

    if (gymId) {
      // Find the user's membership for the selected gym
      const membership = user?.memberships?.find((m) => m.gym._id === gymId);
      const membershipRoles = membership?.roles || [];

      // Check if user is a manager/owner - use membership roles or fallback to global role
      const isManagerInGym =
        membershipRoles.length > 0
          ? membershipRoles.some(
              (role) => role === "owner" || role === "manager"
            )
          : user?.role === "owner" || user?.role === "manager";

      isManagerInGym
        ? navigate({ to: APP_PAGES.gym.manager.home.link })
        : navigate({ to: APP_PAGES.gym.member.home.link });
    }
  };

  const selectedGym = Array.isArray(gyms)
    ? gyms.find((gym) => gym._id === currentGym?._id)
    : undefined;

  return (
    <div className={`relative w-full ${className}`} ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-3 px-2 py-2 rounded-2xl transition-all duration-300 hover:bg-transparent ${
          isMobile ? "scale-90 -ml-2" : ""
        }`}
      >
        <div className="relative flex-shrink-0">
          <div
            className={`${
              isMobile ? "w-11 h-11" : "w-14 h-14"
            } rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/20 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/30 group-hover:scale-105 group-hover:-rotate-3`}
          >
            {selectedGym?.logoUrl ? (
              <img
                src={selectedGym.logoUrl}
                alt={selectedGym.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <Dumbbell
                className={`${
                  isMobile ? "w-6 h-6" : "w-7 h-7"
                } text-white drop-shadow-lg`}
              />
            )}
          </div>
          {selectedGym && (
            <div
              className={`absolute ${
                isMobile
                  ? "-top-1 -right-1 w-4 h-4"
                  : "-top-1.5 -right-1.5 w-5 h-5"
              } rounded-full ${
                selectedGym.isActive !== false ? "bg-success" : "bg-warning"
              } ring-4 ring-background shadow-lg animate-pulse`}
            ></div>
          )}
        </div>

        <div className="flex-1 text-left min-w-0">
          {selectedGym ? (
            <>
              <div
                className={`${
                  isMobile ? "text-base" : "text-xl"
                } font-bold text-text-primary truncate leading-tight tracking-tight`}
              >
                {selectedGym.name}
              </div>
              {selectedGym.city && !isMobile && (
                <div className="flex items-center gap-1.5 text-sm text-text-secondary/70 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{selectedGym.city}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div
                className={`${
                  isMobile ? "text-sm" : "text-lg"
                } font-bold text-text-secondary/60`}
              >
                {t("gym.no_gym_selected", "Select a gym")}
              </div>
              {!isMobile && (
                <div className="text-sm text-text-secondary/50 mt-0.5 font-medium">
                  {gyms.length} available
                </div>
              )}
            </>
          )}
        </div>

        <div
          className={`${
            isMobile ? "w-8 h-8" : "w-10 h-10"
          } rounded-xl bg-surface-hover/50 flex items-center justify-center transition-all duration-300 group-hover:bg-surface-hover group-hover:rotate-180 ${
            isOpen ? "bg-surface-hover rotate-180" : ""
          }`}
        >
          <ChevronDown
            className={`${
              isMobile ? "w-4 h-4" : "w-5 h-5"
            } text-text-secondary`}
          />
        </div>
      </button>

      {isOpen && (
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
            } overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent`}
          >
            {Array.isArray(gyms) && gyms.length > 0 ? (
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
                        setIsOpen(false);
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

                {gyms.map((gym) => {
                  const isSelected = selectedGym && gym._id === selectedGym._id;

                  return (
                    <button
                      key={gym._id}
                      onClick={() => handleGymChange(gym._id)}
                      className={`w-full flex items-center gap-4 px-4 ${
                        isMobile ? "py-3" : "py-4"
                      } rounded-2xl transition-all duration-300 group ${
                        isSelected
                          ? "bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 shadow-lg shadow-primary/10 scale-[1.02]"
                          : "hover:bg-surface-hover/60 hover:scale-[1.01] active:scale-[0.99]"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div
                          className={`${
                            isMobile ? "w-12 h-12" : "w-14 h-14"
                          } rounded-2xl bg-gradient-to-br ${
                            isSelected
                              ? "from-primary via-primary to-secondary shadow-xl shadow-primary/30"
                              : "from-gray-100 to-gray-200 dark:from-gray-800/80 dark:to-gray-700/80 group-hover:scale-105"
                          } flex items-center justify-center transition-all duration-300`}
                        >
                          {gym.logoUrl ? (
                            <img
                              src={gym.logoUrl}
                              alt={gym.name}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <Dumbbell
                              className={`${isMobile ? "w-6 h-6" : "w-7 h-7"} ${
                                isSelected
                                  ? "text-white"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            />
                          )}
                        </div>

                        {isSelected && (
                          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl"></div>
                        )}
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`${
                              isMobile ? "text-base" : "text-lg"
                            } font-bold truncate ${
                              isSelected ? "text-primary" : "text-text-primary"
                            }`}
                          >
                            {gym.name}
                          </span>
                          {gym.isActive === false && (
                            <span className="text-[10px] px-2 py-1 rounded-lg bg-warning/20 text-warning font-bold flex-shrink-0 border border-warning/30">
                              {t("gym.inactive", "Inactive")}
                            </span>
                          )}
                        </div>
                        {gym.city && (
                          <div className="flex items-center gap-1.5 text-sm text-text-secondary/70">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate font-medium">
                              {gym.city}
                            </span>
                          </div>
                        )}
                      </div>

                      {isSelected ? (
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                          <Check
                            className="w-5 h-5 text-white"
                            strokeWidth={3}
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl border-2 border-border/50 group-hover:border-primary/30 transition-colors duration-300"></div>
                      )}
                    </button>
                  );
                })}
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

          {showAllGymsOption && (
            <div className="relative border-t border-white/5 p-3 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
              <button
                onClick={() => {
                  setIsOpen(false);
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

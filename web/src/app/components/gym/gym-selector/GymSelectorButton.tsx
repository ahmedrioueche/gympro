import type { Gym } from "@ahmedrioueche/gympro-client";
import { ChevronDown, Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import useScreen from "../../../../hooks/useScreen";
import { getGymStatusStyles } from "../../../../utils/gym";
import { useGymDisplayRole } from "../../../hooks/useGymDisplayRole";
import { useGymMemberHome } from "../../../pages/main/gym/member/home/hooks/useGymMemberHome";
import RoleBadge from "../RoleBadge";

interface GymSelectorButtonProps {
  selectedGym?: Gym;
  gymsCount: number;
  isOpen: boolean;
  onClick: () => void;
}

export default function GymSelectorButton({
  selectedGym,
  gymsCount,
  isOpen,
  onClick,
}: GymSelectorButtonProps) {
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  const userRole = useGymDisplayRole(selectedGym!);
  const status = useGymMemberHome(selectedGym?.settings);
  const styles = getGymStatusStyles(status);

  return (
    <button
      onClick={onClick}
      title={t("gym.openGymSelector", "Open gym selector")}
      className={`group flex items-center gap-2 md:gap-3 px-1.5 md:px-2 py-2 rounded-2xl transition-all duration-300 hover:bg-transparent min-w-0 max-w-full`}
    >
      <div className="relative flex-shrink-0">
        <div
          className={`${
            isMobile ? "w-10 h-10" : "w-14 h-14"
          } rounded-2xl bg-gradient-to-br ${
            selectedGym
              ? styles.gradient
              : "from-primary to-primary"
          } flex items-center justify-center shadow-xl ${
            selectedGym ? styles.glow : "shadow-primary/20"
          } transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105 group-hover:-rotate-3`}
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
                isMobile ? "w-5 h-5" : "w-7 h-7"
              } text-white drop-shadow-lg`}
            />
          )}
        </div>
        {selectedGym && (
          <div
            className={`absolute ${
              isMobile
                ? "-top-0.5 -right-0.5 w-3.5 h-3.5"
                : "-top-1.5 -right-1.5 w-5 h-5"
            } rounded-full ${
              selectedGym.isActive !== false ? "bg-success" : "bg-warning"
            } ring-3 md:ring-4 ring-background shadow-lg animate-pulse`}
          ></div>
        )}
      </div>

      <div className="flex-1 text-left min-w-0">
        {selectedGym ? (
          <>
            <div
              className={`${
                isMobile ? "text-sm" : "text-xl"
              } font-bold text-text-primary truncate leading-tight tracking-tight`}
            >
              {selectedGym.name}
            </div>
            {userRole && (
              <div className="mt-0.5 md:mt-1">
                <RoleBadge role={userRole} size="sm" />
              </div>
            )}
          </>
        ) : (
          <>
            <div
              className={`${
                isMobile ? "text-sm" : "text-lg"
              } font-bold text-text-secondary/60 truncate`}
            >
              {t("gym.no_gym_selected", "Select a gym")}
            </div>
            {!isMobile && (
              <div className="text-sm text-text-secondary/50 mt-0.5 font-medium">
                {gymsCount} {t("gym.available", "available")}
              </div>
            )}
          </>
        )}
      </div>

      <div
        className={`${
          isMobile ? "w-7 h-7" : "w-10 h-10"
        } rounded-xl bg-surface-hover/50 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-surface-hover group-hover:rotate-180 ${
          isOpen ? "bg-surface-hover rotate-180" : ""
        }`}
      >
        <ChevronDown
          className={`${isMobile ? "w-3.5 h-3.5" : "w-5 h-5"} text-text-secondary`}
        />
      </div>
    </button>
  );
}

import type { Gym } from "@ahmedrioueche/gympro-client";
import { Check, Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import useScreen from "../../../../../hooks/useScreen";
import RoleBadge from "../../RoleBadge";
import { useGymRole } from "../hooks/useGymRole";

interface GymListItemProps {
  gym: Gym;
  isSelected: boolean;
  onSelect: (gymId: string) => void;
}

export default function GymListItem({
  gym,
  isSelected,
  onSelect,
}: GymListItemProps) {
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  const userRole = useGymRole(gym);

  return (
    <button
      onClick={() => onSelect(gym._id)}
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
                isSelected ? "text-white" : "text-gray-400 dark:text-gray-500"
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
        {userRole && (
          <div className="mt-1">
            <RoleBadge role={userRole} size="xs" />
          </div>
        )}
      </div>

      {isSelected ? (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </div>
      ) : (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl border-2 border-border/50 group-hover:border-primary/30 transition-colors duration-300"></div>
      )}
    </button>
  );
}

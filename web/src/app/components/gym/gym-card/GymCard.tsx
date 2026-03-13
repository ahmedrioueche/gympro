import type { Gym } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../context/ThemeContext";
import { useModalStore } from "../../../../store/modal";
import { useGymDisplayRole } from "../../../hooks/useGymDisplayRole";
import { GymCardHeader } from "./GymCardHeader";
import { GymInfoOverview } from "./GymInfoOverview";

interface GymCardProps {
  gym: Gym;
  onSelect: () => void;
  onJoin?: () => void;
  hideActions?: boolean;
}

export default function GymCard({
  gym,
  onSelect,
  onJoin,
  hideActions = false,
}: GymCardProps) {
  const { isDark } = useTheme();
  const { openModal } = useModalStore();
  const displayRole = useGymDisplayRole(gym);

  const handleOpenDetails = () => {
    openModal("gym_details", { gym });
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        if (onJoin && !displayRole) {
          onJoin();
        } else {
          onSelect();
        }
      }}
      className={`w-full hover:cursor-pointer ${
        isDark
          ? "dark:bg-gradient-to-br dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900"
          : "bg-background"
      } border border-border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group relative`}
    >
      <GymCardHeader gym={gym} displayRole={displayRole} />

      <GymInfoOverview
        gym={gym}
        displayRole={displayRole}
        onSelect={onSelect}
        onJoin={onJoin}
        onOpenDetails={handleOpenDetails}
        hideActions={hideActions}
      />

    </div>
  );
}

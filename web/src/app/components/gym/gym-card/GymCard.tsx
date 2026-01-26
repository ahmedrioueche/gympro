import type { Gym } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useTheme } from "../../../../context/ThemeContext";
import { useGymDisplayRole } from "../../../hooks/useGymDisplayRole";
import { GymCardHeader } from "./components/GymCardHeader";
import { GymInfoOverview } from "./components/GymInfoOverview";
import { GymSettingsView } from "./components/GymSettingsView";

interface GymCardProps {
  gym: Gym;
  onSelect: () => void;
}

export default function GymCard({ gym, onSelect }: GymCardProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { isDark } = useTheme();
  const displayRole = useGymDisplayRole(gym);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onSelect();
      }}
      className={`w-full hover:cursor-pointer ${
        isDark
          ? "dark:bg-gradient-to-br dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900"
          : "bg-background"
      } border border-border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group`}
    >
      <GymCardHeader gym={gym} displayRole={displayRole} />

      {!showSettings ? (
        <GymInfoOverview
          gym={gym}
          onSelect={onSelect}
          onToggleSettings={() => setShowSettings(true)}
        />
      ) : (
        <GymSettingsView gym={gym} onBack={() => setShowSettings(false)} />
      )}

      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
    </div>
  );
}

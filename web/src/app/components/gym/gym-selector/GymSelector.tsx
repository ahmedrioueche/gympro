import type { Gym } from "@ahmedrioueche/gympro-client";
import { useRef } from "react";
import GymSelectorButton from "./components/GymSelectorButton";
import GymSelectorDropdown from "./components/GymSelectorDropdown";
import NoGymsView from "./components/NoGymsView";
import SingleGymView from "./components/SingleGymView";
import { useClickOutside } from "./hooks/useClickOutside";
import { useGymFilter } from "./hooks/useGymFilter";
import { useGymSelector } from "./hooks/useGymSelector";

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
  const selectRef = useRef<HTMLDivElement>(null);

  // Filter gyms based on active dashboard
  const filteredGyms = useGymFilter(gyms);

  // Main selector logic
  const { isOpen, setIsOpen, selectedGym, handleGymChange } =
    useGymSelector(filteredGyms);

  // Handle click outside to close dropdown
  useClickOutside(selectRef, () => setIsOpen(false), isOpen);

  // No gyms available
  if (filteredGyms.length === 0) {
    return <NoGymsView />;
  }

  // Single gym - simplified view
  if (filteredGyms.length === 1) {
    const gym = filteredGyms[0];
    return (
      <SingleGymView
        gym={gym}
        isSelected={selectedGym?._id === gym._id}
        onGymChange={handleGymChange}
      />
    );
  }

  // Multiple gyms - dropdown selector
  return (
    <div className={`relative w-full ${className}`} ref={selectRef}>
      <GymSelectorButton
        selectedGym={selectedGym}
        gymsCount={gyms.length}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <GymSelectorDropdown
          gyms={filteredGyms}
          selectedGym={selectedGym}
          onGymSelect={handleGymChange}
          onClose={() => setIsOpen(false)}
          showAllGymsOption={showAllGymsOption}
        />
      )}
    </div>
  );
}

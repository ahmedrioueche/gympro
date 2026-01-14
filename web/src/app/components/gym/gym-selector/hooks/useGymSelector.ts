import type { Gym } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { useGymStore } from "../../../../../store/gym";
import { useUserStore } from "../../../../../store/user";
import { getGymDashboardRoute } from "../../../../../utils/gym-routing";

/**
 * Main hook for GymSelector logic
 */
export function useGymSelector(filteredGyms: Gym[]) {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { currentGym, setGym } = useGymStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedGym = useMemo(
    () => filteredGyms.find((gym) => gym._id === currentGym?._id),
    [filteredGyms, currentGym]
  );

  const handleGymChange = useCallback(
    (gymId: string | null) => {
      setIsOpen(false);
      const selected = filteredGyms.find((g) => g._id === gymId) || null;
      setGym(selected);

      if (selected && user) {
        // Use centralized routing logic based on membership roles
        const route = getGymDashboardRoute(user, selected);
        navigate({ to: route });
      }
    },
    [filteredGyms, setGym, user, navigate]
  );

  return {
    isOpen,
    setIsOpen,
    selectedGym,
    handleGymChange,
  };
}

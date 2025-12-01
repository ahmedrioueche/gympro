import type { Gym } from "@ahmedrioueche/gympro-client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GymState {
  currentGym: Gym | null;

  // Actions
  setGym: (gym: Gym | null) => void;
  clearGym: () => void;
}

export const useGymStore = create<GymState>()(
  persist(
    (set) => ({
      currentGym: null,

      setGym: (gym) => set({ currentGym: gym }),
      clearGym: () => set({ currentGym: null }),
    }),
    {
      name: "gym-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

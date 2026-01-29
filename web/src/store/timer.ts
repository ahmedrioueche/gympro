import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TimerState {
  // Persistence State
  endTime: number | null; // Timestamp when the timer finishes
  totalDuration: number; // Total duration in ms
  isRunning: boolean;
  exerciseName?: string; // Optional: show what we are resting after

  // Actions
  startTimer: (durationSeconds: number, exerciseName?: string) => void;
  stopTimer: () => void;
  addTime: (seconds: number) => void;
  subtractTime: (seconds: number) => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      endTime: null,
      totalDuration: 0,
      isRunning: false,
      exerciseName: undefined,

      startTimer: (durationSeconds, exerciseName) => {
        const now = Date.now();
        const durationMs = durationSeconds * 1000;
        set({
          endTime: now + durationMs,
          totalDuration: durationMs,
          isRunning: true,
          exerciseName,
        });
      },

      stopTimer: () => {
        set({
          endTime: null,
          isRunning: false,
          exerciseName: undefined,
        });
      },

      addTime: (seconds) => {
        const { endTime } = get();
        if (endTime) {
          set({ endTime: endTime + seconds * 1000 });
        }
      },

      subtractTime: (seconds) => {
        const { endTime } = get();
        if (endTime) {
          // Don't go below "now"
          const now = Date.now();
          const newEndTime = Math.max(now, endTime - seconds * 1000);
          set({ endTime: newEndTime });
        }
      },
    }),
    {
      name: "gympro-timer-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

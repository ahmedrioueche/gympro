import { useEffect, useRef, useState } from "react";
import { useTimerStore } from "../../../../store/timer";
import { useUserStore } from "../../../../store/user";

export interface UseRestTimerReturn {
  // Timer state
  remaining: number;
  progress: number;
  isWarning: boolean;
  isCompleted: boolean;
  isActive: boolean;
  exerciseName?: string;

  // Timer actions
  stopTimer: () => void;
  addTime: (seconds: number) => void;
  subtractTime: (seconds: number) => void;

  // Audio refs (needed for the component to render audio elements)
  warningAudioRef: React.RefObject<HTMLAudioElement | null>;
  completionAudioRef: React.RefObject<HTMLAudioElement | null>;

  // Sound settings (for audio element src)
  soundTrack: string;
  warningSoundTrack: string;

  // Formatting helper
  formatTime: (seconds: number) => string;
}

export const useRestTimer = (): UseRestTimerReturn => {
  const {
    endTime,
    totalDuration,
    stopTimer,
    addTime,
    subtractTime,
    exerciseName,
  } = useTimerStore();
  const { user } = useUserStore();

  const [remaining, setRemaining] = useState(0);
  const [progress, setProgress] = useState(100);
  const [isWarning, setIsWarning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // User preferences
  const alarmDuration = user?.appSettings?.timer?.alarmDuration ?? 3;
  const soundType = user?.appSettings?.timer?.sound ?? "beep";
  const soundTrack = user?.appSettings?.timer?.soundTrack ?? "beep_1";
  const warningSeconds = user?.appSettings?.timer?.warningSeconds ?? 5;
  const warningSoundTrack =
    user?.appSettings?.timer?.warningSoundTrack ?? "beep_1";

  // Audio refs - separate for warning and completion
  const warningAudioRef = useRef<HTMLAudioElement | null>(null);
  const completionAudioRef = useRef<HTMLAudioElement | null>(null);

  // Track if warning has been played for this timer session
  const hasPlayedWarningRef = useRef(false);

  // Reset flags when timer starts/changes
  useEffect(() => {
    if (endTime) {
      hasPlayedWarningRef.current = false;
      setIsWarning(false);
      setIsCompleted(false);
    }
  }, [endTime]);

  // Main timer interval
  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;
      const remainingSecs = Math.ceil(diff / 1000);

      if (diff <= 0) {
        // Timer finished
        setRemaining(0);
        setProgress(0);
        setIsWarning(false);
        setIsCompleted(true);

        // Completion sound/vibration
        if (soundType === "beep" && completionAudioRef.current) {
          const audio = completionAudioRef.current;
          audio
            .play()
            .catch((e) => console.error("Completion audio failed", e));

          // Stop audio after alarmDuration
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, alarmDuration * 1000);
        } else if (soundType === "vibrate") {
          if ("vibrate" in navigator) {
            navigator.vibrate([500, 200, 500]);
          }
        }

        // Auto-stop after alarmDuration
        setTimeout(() => {
          stopTimer();
        }, alarmDuration * 1000);

        clearInterval(interval);
      } else {
        setRemaining(remainingSecs);
        const p = Math.min(100, Math.max(0, (diff / totalDuration) * 100));
        setProgress(p);

        // Warning countdown logic
        if (
          remainingSecs <= warningSeconds &&
          !hasPlayedWarningRef.current &&
          soundType === "beep"
        ) {
          hasPlayedWarningRef.current = true;
          setIsWarning(true);

          if (warningAudioRef.current) {
            warningAudioRef.current
              .play()
              .catch((e) => console.error("Warning audio failed", e));
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    endTime,
    totalDuration,
    stopTimer,
    soundType,
    alarmDuration,
    warningSeconds,
  ]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return {
    remaining,
    progress,
    isWarning,
    isCompleted,
    isActive: !!endTime,
    exerciseName,
    stopTimer,
    addTime,
    subtractTime,
    warningAudioRef,
    completionAudioRef,
    soundTrack,
    warningSoundTrack,
    formatTime,
  };
};

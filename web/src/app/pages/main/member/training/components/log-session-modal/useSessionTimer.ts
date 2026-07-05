import { useCallback, useEffect, useState } from "react";

/** Formats elapsed time: H:MM:SS when hours > 0, M:SS when minutes > 0, else seconds only. */
const formatElapsed = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const ss = s.toString().padStart(2, "0");

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${ss}`;
  }
  if (m > 0) {
    return `${m}:${ss}`;
  }
  return String(s);
};

interface UseSessionTimerProps {
  isOpen: boolean;
  startedAt: number | null;
}

export const useSessionTimer = ({ isOpen, startedAt }: UseSessionTimerProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen || startedAt === null) {
      setElapsedSeconds(0);
      return;
    }

    const tick = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isOpen, startedAt]);

  const getDurationMinutes = useCallback(() => {
    const seconds =
      startedAt === null
        ? 0
        : Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
    return Math.max(1, Math.round(seconds / 60));
  }, [startedAt]);

  return {
    elapsedSeconds,
    formattedElapsed: formatElapsed(elapsedSeconds),
    isRunning: isOpen && startedAt !== null,
    getDurationMinutes,
  };
};

export const computeDurationMinutes = (startedAt: number | null): number => {
  if (startedAt === null) return 1;
  const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  return Math.max(1, Math.round(seconds / 60));
};

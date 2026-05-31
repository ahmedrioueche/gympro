import { useCallback, useEffect, useState } from "react";

function getFullscreenElement(): Element | null {
  return (
    document.fullscreenElement ??
    (document as Document & { webkitFullscreenElement?: Element })
      .webkitFullscreenElement ??
    null
  );
}

function isFullscreenApiAvailable(): boolean {
  const doc = document.documentElement as HTMLElement & {
    requestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => void;
  };
  return Boolean(
    doc.requestFullscreen ??
      doc.webkitRequestFullscreen ??
      document.exitFullscreen ??
      (document as Document & { webkitExitFullscreen?: () => void })
        .webkitExitFullscreen,
  );
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(
    () => getFullscreenElement() !== null,
  );
  const [isSupported] = useState(() => isFullscreenApiAvailable());

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(getFullscreenElement() !== null);
    };

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async (): Promise<boolean> => {
    const doc = document.documentElement as HTMLElement & {
      requestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => void;
    };

    try {
      if (getFullscreenElement()) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else {
          (
            document as Document & { webkitExitFullscreen?: () => void }
          ).webkitExitFullscreen?.();
        }
      } else if (doc.requestFullscreen) {
        await doc.requestFullscreen();
      } else {
        doc.webkitRequestFullscreen?.();
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  return { isFullscreen, isSupported, toggleFullscreen };
}

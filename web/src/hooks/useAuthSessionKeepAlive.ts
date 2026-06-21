import { ensureValidAccessToken } from "../lib/ensureValidAccessToken";
import { useEffect } from "react";
import { useUserStore } from "../store/user";

/** Refresh auth tokens when the app returns from background (e.g. screen off during a workout). */
export const useAuthSessionKeepAlive = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshIfNeeded = () => {
      if (document.visibilityState === "visible") {
        void ensureValidAccessToken();
      }
    };

    refreshIfNeeded();
    document.addEventListener("visibilitychange", refreshIfNeeded);
    window.addEventListener("focus", refreshIfNeeded);

    return () => {
      document.removeEventListener("visibilitychange", refreshIfNeeded);
      window.removeEventListener("focus", refreshIfNeeded);
    };
  }, [isAuthenticated]);
};

import { LANGUAGES } from "@ahmedrioueche/gympro-client";
import { Outlet, useLocation } from "@tanstack/react-router";
import { ensureValidAccessToken } from "@ahmedrioueche/gympro-client";
import { useEffect, useRef } from "react";
import { TopBanner } from "./components/TopBanner";
import { BG_GRADIENT } from "./constants/styles";
import { useTheme } from "./context/ThemeContext";
import { useAuthSessionKeepAlive } from "./hooks/useAuthSessionKeepAlive";
import { useWelcomeTour } from "./hooks/useWelcomeTour";
import Modals from "./modals";
import { useLanguageStore } from "./store/language";
import { useUserStore } from "./store/user";
import { resetAllScrollers } from "./utils/scroll";

const App = () => {
  const { isDark } = useTheme();
  const { user } = useUserStore();
  const { setLanguage, language } = useLanguageStore();
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Welcome Tour observer
  useWelcomeTour();
  useAuthSessionKeepAlive();

  // Sync language with user settings
  useEffect(() => {
    const userLanguage = user?.appSettings?.locale?.language;
    if (userLanguage) {
      setLanguage(userLanguage);
    }
  }, [user?.appSettings?.locale?.language, setLanguage]);

  // Handle RTL layout dynamically from language configuration
  useEffect(() => {
    const isRtl = LANGUAGES[language]?.isRtl || false;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [language]);

  // Scroll to top on route change
  useEffect(() => {
    resetAllScrollers();
  }, [pathname]);

  return (
    <div
      className={`font-primary flex flex-col min-h-screen
     ${isDark ? BG_GRADIENT : "bg-background"}`}
    >
      <TopBanner />
      <div
        ref={scrollRef}
        id="app-scroller"
        className="flex-1 overflow-auto flex flex-col"
      >
        <Outlet />
      </div>
      <Modals />
    </div>
  );
};

export default App;

import { Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { TopBanner } from "./components/TopBanner";
import { BG_GRADIENT } from "./constants/styles";
import { useTheme } from "./context/ThemeContext";
import Modals from "./modals";
import { useLanguageStore } from "./store/language";
import { useUserStore } from "./store/user";

const App = () => {
  const { isDark } = useTheme();
  const { user } = useUserStore();
  const { setLanguage } = useLanguageStore();
  const { pathname } = useLocation();

  // Sync language with user settings
  useEffect(() => {
    const userLanguage = user?.appSettings?.locale?.language;
    if (userLanguage) {
      setLanguage(userLanguage);
    }
  }, [user?.appSettings?.locale?.language, setLanguage]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      className={`font-primary flex flex-col min-h-screen
     ${isDark ? BG_GRADIENT : "bg-background"}`}
    >
      <TopBanner />
      <div className="flex-1 overflow-auto flex flex-col">
        <Outlet />
      </div>
      <Modals />
    </div>
  );
};

export default App;

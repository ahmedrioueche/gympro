import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { BG_GRADIENT } from "./constants/styles";
import { useTheme } from "./context/ThemeContext";
import Modals from "./modals";
import { useLanguageStore } from "./store/language";
import { useUserStore } from "./store/user";

const App = () => {
  const { isDark } = useTheme();
  const { user } = useUserStore();
  const { setLanguage } = useLanguageStore();

  // Sync language with user settings
  useEffect(() => {
    const userLanguage = user?.appSettings?.locale?.language;
    if (userLanguage) {
      setLanguage(userLanguage);
    }
  }, [user?.appSettings?.locale?.language, setLanguage]);

  return (
    <div
      className={`font-primary
     ${isDark ? BG_GRADIENT : "bg-background"}`}
    >
      <Outlet />
      <Modals />
    </div>
  );
};

export default App;

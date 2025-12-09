import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { bgGradient } from "./constants/styles";
import { useTheme } from "./context/ThemeContext";
import { useGymStore } from "./store/gym";

const App = () => {
  const { isDark } = useTheme();
  const { clearGym } = useGymStore();

  useEffect(() => {
    return () => {
      clearGym();
    };
  }, []);

  return (
    <div
      className={`font-primary max-w-[1920px]
     ${isDark ? bgGradient : "bg-background"}`}
    >
      <Outlet />
    </div>
  );
};

export default App;

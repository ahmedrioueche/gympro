import { Outlet } from "@tanstack/react-router";
import { bgGradient } from "./constants/styles";
import { useTheme } from "./context/ThemeContext";
import Modals from "./modals";

const App = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`font-primary
     ${isDark ? bgGradient : "bg-background"}`}
    >
      <Outlet />
      <Modals />
    </div>
  );
};

export default App;

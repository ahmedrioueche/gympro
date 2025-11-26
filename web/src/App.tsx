import { Outlet } from "@tanstack/react-router";
import { bgGradient } from "./constants/styles";
import { useTheme } from "./context/ThemeContext";

const App = () => {
  const { mode } = useTheme();
  return (
    <div
      className={`font-primary max-w-[1920px]
     ${mode === "dark" ? bgGradient : "bg-background"}`}
    >
      <Outlet />
    </div>
  );
};

export default App;

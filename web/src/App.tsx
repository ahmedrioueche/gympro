import { Outlet } from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { bgGradient } from "./constants/styles";
import { useTheme } from "./context/ThemeContext";
import { useGymStore } from "./store/gym";

const ConfirmModal = lazy(() => import("./components/ConfirmModal"));

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
      className={`font-primary
     ${isDark ? bgGradient : "bg-background"}`}
    >
      <Outlet />
      <Suspense fallback={null}>
        <ConfirmModal />
      </Suspense>
    </div>
  );
};

export default App;

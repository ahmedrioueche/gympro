import { Outlet } from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { bgGradient } from "./constants/styles";
import { useTheme } from "./context/ThemeContext";
import { useGymStore } from "./store/gym";

const ConfirmModal = lazy(() => import("./components/ConfirmModal"));
const UpgradePreviewModal = lazy(
  () =>
    import(
      "./app/pages/main/manager/subscription/components/UpgradePreviewModal"
    )
);

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
        <UpgradePreviewModal />
      </Suspense>
    </div>
  );
};

export default App;

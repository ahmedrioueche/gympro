import { useUserStore } from "../../../store/user";
import { getShowActocoreWidget } from "../../../utils/actocoreSettings";
import ActoCore from "./ActoCore";

/** Renders ActoCore only when the user is signed in and has not hidden the widget. */
export default function ActoCoreGate() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  const showWidget = getShowActocoreWidget(user?.appSettings);

  if (!import.meta.env.VITE_ACTOCORE_API_KEY || !isAuthenticated || !showWidget) {
    return null;
  }

  return <ActoCore />;
}

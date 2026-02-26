import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarFooterProps {
  isMobile: boolean;
  isPinned: boolean;
  isCollapsed: boolean;
  onTogglePin: () => void;
  onLogout: () => void;
}

export const SidebarFooter = ({
  isMobile,
  isPinned,
  isCollapsed,
  onTogglePin,
  onLogout,
}: SidebarFooterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex-shrink-0 p-4">
      {/* Desktop: Pin/Unpin button */}
      {!isMobile && (
        <button
          onClick={onTogglePin}
          className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            isPinned
              ? "bg-primary/20 text-primary hover:bg-primary/30"
              : "bg-primary/20 text-text-secondary hover:bg-primary/30 hover:text-text-primary"
          } group`}
        >
          {/* Icon - Fixed width */}
          {isPinned ? (
            <PanelLeftClose className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          ) : (
            <PanelLeftOpen className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          )}

          {/* Text - absolute positioning */}
          <span
            className={`text-sm font-semibold whitespace-nowrap transition-opacity duration-300 ${
              isCollapsed
                ? "opacity-0 pointer-events-none absolute"
                : "opacity-100"
            }`}
          >
            {isPinned ? t("sidebar.unpin") : t("sidebar.pin")}
          </span>
        </button>
      )}

      {/* Mobile: Logout button */}
      {isMobile && (
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 bg-danger/20 text-danger hover:bg-danger/30 group`}
        >
          {/* Icon - Fixed width */}
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />

          {/* Text */}
          <span className={`text-sm font-semibold whitespace-nowrap`}>
            {t("actions.logout")}
          </span>
        </button>
      )}
    </div>
  );
};

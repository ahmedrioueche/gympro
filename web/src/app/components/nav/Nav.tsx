import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import GymSelector from "../gym/gym-selector/GymSelector";
import SidebarAnimatedLogo from "../SidebarAnimatedLogo";
import { SidebarFooter } from "./components/SidebarFooter";
import { SidebarMenuItem } from "./components/SidebarMenuItem";
import { TopRightControls } from "./components/TopRightControls";
import { useNav } from "./hooks/useNav";

export default function Nav({ children, sidebarLinks = null }) {
  const { t } = useTranslation();
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarExpanded,
    setSidebarExpanded,
    isPinned,
    togglePin,
    sidebarRef,
    isMobile,
    activeRoute,
    gyms,
    isCollapsed,
    handleProfileClick,
    handleSettingsClick,
    handleMembershipsClick,
    handleLogout,
    navigateToHome,
  } = useNav();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* SIDEBAR - Only render if sidebarLinks are provided */}
      {sidebarLinks && (
        <div
          ref={sidebarRef}
          className={`h-screen flex backdrop-blur-lg ${
            isMobile
              ? "bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900"
              : ""
          }
            flex-col fixed md:relative z-40 transition-all duration-300 
          shadow-[2px_0_8px_rgba(0,0,0,0.15)]

      ${
        isMobile
          ? `${sidebarOpen ? "translate-x-0" : "-translate-x-64"} w-64`
          : sidebarExpanded || isPinned
            ? "w-56"
            : "w-20"
      }`}
          onMouseEnter={() =>
            !isMobile && !isPinned && setSidebarExpanded(true)
          }
          onMouseLeave={() =>
            !isMobile && !isPinned && setSidebarExpanded(false)
          }
        >
          {/* Sidebar Header */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <SidebarAnimatedLogo
                collapsed={isCollapsed}
                onClick={navigateToHome}
              />
              {/* Close button - Mobile only */}
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 mr-4 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <X className="w-5 h-5 text-text-primary" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1 px-2 py-3 space-y-2 overflow-y-auto hide-scrollbar">
            {sidebarLinks.map((link) => {
              const isActive = link.matchPaths.some((p) => activeRoute === p);
              return (
                <SidebarMenuItem
                  key={link.path}
                  link={link}
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                  onItemClick={() => setSidebarOpen(false)}
                />
              );
            })}
          </nav>
          <SidebarFooter
            isMobile={isMobile}
            isPinned={isPinned}
            isCollapsed={isCollapsed}
            onTogglePin={togglePin}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* OVERLAY (Mobile) - Only render if sidebar exists */}
      {sidebarLinks && isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top Bar: Menu button + GymSelector left, controls right */}
        <div className={`flex items-center justify-between min-h-[80px]`}>
          <div className="flex items-center gap-3 flex-1">
            {/* Show logo when no sidebar */}
            {!sidebarLinks && !isMobile && (
              <div className="flex items-center mr-6 ">
                <SidebarAnimatedLogo
                  collapsed={false}
                  onClick={navigateToHome}
                />
              </div>
            )}

            {/* Mobile menu button - only show if sidebar exists */}
            {sidebarLinks && isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 rounded-xl bg-background shadow-lg border border-border hover:bg-surface-hover transition-all duration-300 hover:scale-110"
              >
                <Menu className="w-6 h-6 text-text-primary" />
              </button>
            )}
            <div
              className={`${
                sidebarLinks ? " md:px-10" : " md:px-[61px] md:-mt-2"
              }`}
            >
              <GymSelector gyms={gyms} />
            </div>
          </div>
          <div className={`${sidebarLinks ? "" : "md:-mt-2"}`}>
            <TopRightControls
              onProfileClick={handleProfileClick}
              onSettingsClick={handleSettingsClick}
              onMembershipsClick={handleMembershipsClick}
              onLogoutClick={handleLogout}
            />
          </div>
        </div>

        {/* Page Content Area */}
        <div className="flex-1 overflow-auto">
          {children ? (
            children
          ) : (
            <div className="p-6 md:p-8">
              <div className="rounded-xl p-8 text-center shadow-sm border border-border">
                <h1 className="text-3xl font-bold mb-2 text-text-primary">
                  {t("common.welcome")}
                </h1>
                <p className="text-text-secondary">
                  {t("common.selectSection")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

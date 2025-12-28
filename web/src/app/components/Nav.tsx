import { authApi } from "@ahmedrioueche/gympro-client";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../constants/navigation";
import { useAllMyGyms } from "../../hooks/queries/useGyms";
import useScreen from "../../hooks/useScreen";
import { useSidebarStore } from "../../store/sidebar";
import { useUserStore } from "../../store/user";
import { getRoleHomePage } from "../../utils/roles";
import GymSelector from "./GymSelector";
import NotificationsDropdown from "./NotificationsDropdown";
import ProfileDropdown from "./ProfileDropdown";
import SidebarAnimatedLogo from "./SidebarAnimatedLogo";

export default function Nav({ children, sidebarLinks }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // for desktop hover
  const { isPinned, togglePin } = useSidebarStore();
  const sidebarRef = useRef(null);
  const { isMobile } = useScreen();
  const { user, setUser } = useUserStore();
  const activeRoute = location.pathname;
  const { data: gyms = [] } = useAllMyGyms();

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }
    if (sidebarOpen && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [sidebarOpen, isMobile]);

  // Dropdown handlers
  const handleProfileClick = () => {};
  const handleSettingsClick = () => {};
  const handleMembershipsClick = () => {};
  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      window.location.href = APP_PAGES.login.link;
    } catch (e) {
      // handle error
    }
  };

  // Sidebar menu item with light sweep effect
  const SidebarMenuItem = ({ link, isActive }) => {
    const isCollapsed = !sidebarExpanded && !isMobile && !isPinned;

    return (
      <Link
        key={link.path}
        to={link.path}
        onClick={() => setSidebarOpen(false)}
        className="w-full block"
      >
        <button
          className={`sidebar-menu-item w-full group relative overflow-hidden rounded-r-xl flex items-center gap-3 px-3 py-3.5 transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-md"
              : "text-text-secondary hover:text-text-primary hover:bg-gradient-to-r hover:from-primary/25 via-accent/20 hover:to-secondary/25"
          }`}
          tabIndex={0}
        >
          {/* Light sweep effect */}
          <span className="absolute inset-0 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-full transition-all duration-500 ease-out"></span>

          {/* Icon - Fixed width to prevent shifting */}
          <span className="flex-shrink-0 relative z-10 flex items-center justify-center w-8">
            {link.icon}
          </span>

          {/* Text - absolute positioning prevents layout shift */}
          <span
            className={`relative z-10 font-semibold text-sm whitespace-nowrap transition-opacity duration-300 ${
              isCollapsed
                ? "opacity-0 pointer-events-none absolute"
                : "opacity-100"
            }`}
          >
            {t(`sidebar.${link.label}`)}
          </span>
        </button>
      </Link>
    );
  };

  // Sidebar footer
  const SidebarFooter = () => {
    const isCollapsed = !sidebarExpanded && !isMobile && !isPinned;

    return (
      <div className="flex-shrink-0 p-4">
        {/* Desktop: Pin/Unpin button */}
        {!isMobile && (
          <button
            onClick={togglePin}
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
            onClick={handleLogout}
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

  // Top right controls
  const TopRightControls = () => (
    <div className="flex items-center gap-2 md:gap-4 px-4 py-4">
      <NotificationsDropdown />

      <ProfileDropdown
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onMembershipsClick={handleMembershipsClick}
        onLogoutClick={handleLogout}
        disabled
      />
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* SIDEBAR */}
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
        onMouseEnter={() => !isMobile && !isPinned && setSidebarExpanded(true)}
        onMouseLeave={() => !isMobile && !isPinned && setSidebarExpanded(false)}
      >
        {/* Sidebar Header */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <SidebarAnimatedLogo
              collapsed={!sidebarExpanded && !isMobile && !isPinned}
              onClick={() => {
                const url = getRoleHomePage(user.role as any);
                navigate({ to: url });
              }}
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
        <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto hide-scrollbar">
          {sidebarLinks.map((link) => {
            const isActive = link.matchPaths.some((p) => activeRoute === p);
            return (
              <SidebarMenuItem
                key={link.path}
                link={link}
                isActive={isActive}
              />
            );
          })}
        </nav>
        <SidebarFooter />
      </div>

      {/* OVERLAY (Mobile) */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top Bar: Menu button + GymSelector left, controls right */}
        <div className="flex items-center justify-between min-h-[80px] px-1 md:px-6">
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile menu button - relative positioning */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 rounded-xl bg-background shadow-lg border border-border hover:bg-surface-hover transition-all duration-300 hover:scale-110"
              >
                <Menu className="w-6 h-6 text-text-primary" />
              </button>
            )}
            <GymSelector gyms={gyms} />
          </div>
          <TopRightControls />
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

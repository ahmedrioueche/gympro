import { authApi, type UserRole } from "@ahmedrioueche/gympro-client";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedLogo from "../../components/ui/AnimatedLogo";
import { APP_PAGES } from "../../constants/navigation";
import { bgGradient } from "../../constants/styles";
import { useTheme } from "../../context/ThemeContext";
import { useAllMyGyms } from "../../hooks/queries/useGyms";
import useScreen from "../../hooks/useScreen";
import { useUserStore } from "../../store/user";
import { getRoleHomePage } from "../../utils/roles";
import GymSelector from "./GymSelector";
import NotificationsDropdown from "./NotificationsDropdown";
import ProfileDropdown from "./ProfileDropdown";

export default function Nav({ children, sidebarLinks }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode, toggleMode } = useTheme();
  const sidebarRef = useRef(null);
  const { isMobile } = useScreen();
  const { user, setUser } = useUserStore();
  const activeRoute = location.pathname;

  // Fetch all gyms for current user (owned + member)
  const { data: gyms = [] } = useAllMyGyms();

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [sidebarOpen]);

  // Dropdown handlers
  const handleProfileClick = () => {
    console.log("Navigate to profile");
  };

  const handleSettingsClick = () => {
    console.log("Navigate to settings");
  };

  const handleMembershipsClick = () => {
    console.log("Navigate to memberships");
  };

  const handleLogout = async () => {
    console.log("Logout user");
    try {
      await authApi.logout();
      setUser(null);
      window.location.href = APP_PAGES.login.link;
    } catch (e) {
      console.log(e);
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    console.log("Notification clicked:", notificationId);
  };

  const handleViewAllNotifications = () => {
    console.log("Navigate to all notifications");
  };

  const handleBack = () => {
    navigate({ to: ".." });
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden`}>
      {/* SIDEBAR */}
      <div
        ref={sidebarRef}
        className={` ${
          isMobile ? (mode === "dark" ? bgGradient : "bg-background") : null
        } fixed md:relative z-40 h-screen w-64 transform transition-all duration-300 ease-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex-shrink-0 p-6 md:pr-6 pr-3 py-3 border-b border-border ">
          <div className="flex items-center justify-between">
            <AnimatedLogo
              height="h-7"
              logoSize="w-10 h-10"
              textSize="md:text-xl text-lg"
              leftPosition="20%"
              paddingTop="pt-2"
              onClick={() => {
                const url = getRoleHomePage(user.role as UserRole);
                navigate({ to: url });
              }}
            />
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-border"
            >
              <span className="text-text-secondary">✕</span>
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto hide-scrollbar border-r border-border">
          {sidebarLinks.map((link) => {
            const isActive = link.matchPaths.some((p) => activeRoute === p);

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className="w-full block"
              >
                <button
                  className={`w-full group relative overflow-hidden rounded-lg p-3 text-left transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                      : "text-text-primary hover"
                  }`}
                >
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5 flex-shrink-0">
                        {link.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {t(`sidebar.${link.label}`)}
                        </div>
                        <div
                          className={`text-xs opacity-75 mt-0.5 ${
                            isActive ? "text-white/80" : "text-text-secondary"
                          }`}
                        >
                          {t(`sidebar.${link.description}`)}
                        </div>
                      </div>
                    </div>
                    <span className={isActive ? "opacity-100" : "opacity-50"}>
                      →
                    </span>
                  </div>
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 p-4 border-t border-r border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-danger/20 text-danger hover:bg-danger/30"
          >
            <span>🚪</span>
            <span className="text-sm">{t("actions.logout")}</span>
          </button>
        </div>
      </div>

      {/* OVERLAY (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 opacity-20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <nav className="sticky top-0 z-20 border-b border-border backdrop-blur-lg ">
          <div className="pr-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg transition-colors "
              >
                <span className="text-text-secondary">☰</span>
              </button>

              <div className="flex items-center gap-3">
                {/* Back Button - Desktop Only */}
                <button
                  onClick={handleBack}
                  className="hidden md:flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-border text-text-secondary hover:text-text-primary"
                  title={t("actions.back")}
                >
                  <span className="text-lg">←</span>
                </button>

                <div className="flex-1 min-w-[200px]">
                  <GymSelector gyms={gyms} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={toggleMode}
                className="p-2 rounded-lg transition-colors  text-warning"
              >
                {mode === "dark" ? "☀️" : "🌙"}
              </button>

              {/* Notifications Dropdown */}
              <NotificationsDropdown
                onNotificationClick={handleNotificationClick}
                onViewAllClick={handleViewAllNotifications}
              />

              {/* Profile Dropdown */}
              <ProfileDropdown
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                onMembershipsClick={handleMembershipsClick}
                onLogoutClick={handleLogout}
              />
            </div>
          </div>
        </nav>

        {/* Page Content Area */}
        <div className="flex-1 overflow-auto ">
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

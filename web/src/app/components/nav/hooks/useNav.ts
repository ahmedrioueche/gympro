import { authApi } from "@ahmedrioueche/gympro-client";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { APP_PAGES } from "../../../../constants/navigation";
import { useAllMyGyms } from "../../../../hooks/queries/useGyms";
import useScreen from "../../../../hooks/useScreen";
import { useGymStore } from "../../../../store/gym";
import { useSidebarStore } from "../../../../store/sidebar";
import { useUserStore } from "../../../../store/user";
import { getRoleHomePage } from "../../../../utils/roles";

export const useNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // for desktop hover
  const { isPinned, togglePin } = useSidebarStore();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useScreen();
  const { user, setUser } = useUserStore();
  const { clearGym } = useGymStore();
  const activeRoute = location.pathname;
  const { data: gyms = [] } = useAllMyGyms();

  // Clear gym selection when navigating away from gym routes
  useEffect(() => {
    const isOnGymRoute = activeRoute.startsWith("/gym");
    if (!isOnGymRoute) {
      clearGym();
    }
  }, [activeRoute, clearGym]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
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
  const handleSettingsClick = () => {
    if (user.role === "manager" || user.role === "owner") {
      navigate({ to: APP_PAGES.manager.settings.link });
    } else {
      navigate({ to: APP_PAGES.member.settings.link });
    }
  };
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

  const navigateToHome = () => {
    const url = getRoleHomePage(user?.role as any);
    navigate({ to: url });
  };

  const isCollapsed = !sidebarExpanded && !isMobile && !isPinned;

  return {
    // State
    sidebarOpen,
    setSidebarOpen,
    sidebarExpanded,
    setSidebarExpanded,
    isPinned,
    togglePin,
    sidebarRef,
    isMobile,
    user,
    activeRoute,
    gyms,
    isCollapsed,
    // Handlers
    handleProfileClick,
    handleSettingsClick,
    handleMembershipsClick,
    handleLogout,
    navigateToHome,
  };
};

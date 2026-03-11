import { authApi } from "@ahmedrioueche/gympro-client";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { APP_PAGES } from "../../../constants/navigation";
import { useAllMyGyms } from "../../../hooks/queries/useGyms";
import useScreen from "../../../hooks/useScreen";
import { useGymStore } from "../../../store/gym";
import { useLanguageStore } from "../../../store/language";
import { useModalStore } from "../../../store/modal";
import { useSidebarStore } from "../../../store/sidebar";
import { useUserStore } from "../../../store/user";
import { getRoleHomePage } from "../../../utils/roles";

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
  const { openModal } = useModalStore();

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
  const handleProfileClick = () => {
    openModal("user_profile", { user });
  };

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
    const { activeDashboard } = useUserStore.getState();
    // Prefer active dashboard for navigation, fallback to role-based
    if (activeDashboard === "manager") {
      navigate({ to: APP_PAGES.manager.link });
    } else if (activeDashboard === "coach") {
      navigate({ to: APP_PAGES.coach.link });
    } else if (activeDashboard === "admin") {
      navigate({ to: APP_PAGES.admin.link });
    } else {
      const url = getRoleHomePage(user?.role as any);
      navigate({ to: url });
    }
  };

  // Touch gestures for mobile sidebar
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeTranslation, setSwipeTranslation] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const swipeThreshold = 50;
  const edgeThreshold = 40; // Increased edge threshold
  const sidebarWidth = 256;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const startX = e.touches[0].clientX;
    const screenWidth = window.innerWidth;
    const isFromEdge = isRtl 
      ? startX > screenWidth - edgeThreshold 
      : startX < edgeThreshold;

    // Only start swiping if we are opening from edge OR closing while open
    if (sidebarOpen || isFromEdge) {
      touchStartX.current = startX;
      setIsSwiping(true);
      // Initialize with current state position
      setSwipeTranslation(sidebarOpen ? 0 : (isRtl ? sidebarWidth : -sidebarWidth));
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || touchStartX.current === null) return;
    
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const base = sidebarOpen ? 0 : (isRtl ? sidebarWidth : -sidebarWidth);
    let newTranslation = base + deltaX;

    // Clamp
    if (isRtl) {
      newTranslation = Math.min(sidebarWidth, Math.max(0, newTranslation));
    } else {
      newTranslation = Math.min(0, Math.max(-sidebarWidth, newTranslation));
    }
    
    setSwipeTranslation(newTranslation);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || touchStartX.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const absDeltaX = Math.abs(deltaX);
    
    if (absDeltaX > swipeThreshold) {
      if (sidebarOpen) {
        // Closing
        if (isRtl) {
          if (deltaX > swipeThreshold) setSidebarOpen(false);
        } else {
          if (deltaX < -swipeThreshold) setSidebarOpen(false);
        }
      } else {
        // Opening
        if (isRtl) {
          if (deltaX < -swipeThreshold) setSidebarOpen(true);
        } else {
          if (deltaX > swipeThreshold) setSidebarOpen(true);
        }
      }
    }

    setIsSwiping(false);
    setSwipeTranslation(0);
    touchStartX.current = null;
  };

  const { isRtl } = useLanguageStore();
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
    isRtl,
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
    // Gesture Handlers
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping,
    swipeTranslation,
  };
};

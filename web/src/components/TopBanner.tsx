import type { AppBanner } from "@ahmedrioueche/gympro-client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useActiveBanners } from "../hooks/queries/useBanners";
import { useModalStore } from "../store/modal";

const DISMISSED_KEY = "gympro_dismissed_banners";

export const TopBanner: React.FC = () => {
  const { data: response, isLoading } = useActiveBanners();
  const banners = Array.isArray(response) ? response : (response as any)?.data;
  const { i18n } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleBanners, setVisibleBanners] = useState<AppBanner[]>([]);
  const { openModal } = useModalStore();

  useEffect(() => {
    if (!banners || !banners.length) {
      setVisibleBanners([]);
      return;
    }

    try {
      const dismissedStr = localStorage.getItem(DISMISSED_KEY);
      const dismissed = dismissedStr ? JSON.parse(dismissedStr) : {};

      const now = new Date().getTime();
      const active = banners.filter((b) => {
        if (!b.isRemovable) return true;
        const dismissedAt = dismissed[b._id];
        if (!dismissedAt) return true;

        if (b.frequencyHours === 0) return false;

        const hoursPassed = (now - dismissedAt) / (1000 * 60 * 60);
        return hoursPassed >= b.frequencyHours;
      });

      // Check if there's any active error banner (like subscription blocker)
      const errorBanner = active.find((b) => b.variant === "error");

      if (errorBanner) {
        // Enforce non-removable for error banners
        errorBanner.isRemovable = false;
        setVisibleBanners([errorBanner]);
      } else {
        setVisibleBanners(active);
      }
    } catch (e) {
      const errorBanner = banners.find((b: AppBanner) => b.variant === "error");
      if (errorBanner) {
        errorBanner.isRemovable = false;
        setVisibleBanners([errorBanner]);
      } else {
        setVisibleBanners(banners);
      }
    }
  }, [banners]);

  // Auto-cycle banners every 5 seconds if there is more than 1
  useEffect(() => {
    if (visibleBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [visibleBanners.length]);

  if (isLoading || visibleBanners.length === 0) return null;

  const currentBanner = visibleBanners[currentIndex % visibleBanners.length];
  if (!currentBanner) return null;

  const handleDismiss = () => {
    try {
      const dismissedStr = localStorage.getItem(DISMISSED_KEY) || "{}";
      const dismissed = JSON.parse(dismissedStr);
      dismissed[currentBanner._id] = new Date().getTime();
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));

      const newVisible = visibleBanners.filter(
        (b) => b._id !== currentBanner._id,
      );
      setVisibleBanners(newVisible);
      if (currentIndex >= newVisible.length) {
        setCurrentIndex(0);
      }
    } catch (e) {
      console.error("Failed to dismiss banner", e);
    }
  };

  const handleAction = () => {
    if (!currentBanner.action || currentBanner.action.type === "none") return;

    if (currentBanner.action.type === "link" && currentBanner.action.payload) {
      window.open(currentBanner.action.payload, "_blank");
    } else if (
      currentBanner.action.type === "modal" &&
      currentBanner.action.payload
    ) {
      openModal(currentBanner.action.payload as any);
    }
  };

  const nextBanner = () =>
    setCurrentIndex((prev) => (prev + 1) % visibleBanners.length);
  const prevBanner = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + visibleBanners.length) % visibleBanners.length,
    );

  // Get translated text
  const text =
    currentBanner.translations?.[i18n.language] ||
    currentBanner.translations?.["en"] ||
    "Notice";

  let bgClass = "bg-blue-600";
  let textClass = "text-white";

  switch (currentBanner.variant) {
    case "warning":
      bgClass = "bg-yellow-500";
      textClass = "text-black";
      break;
    case "error":
      bgClass = "bg-red-600";
      break;
    case "success":
      bgClass = "bg-green-600";
      break;
    case "info":
      bgClass = "bg-blue-600";
      break;
  }

  // Override config if specific color provided (hex)
  const customStyle: React.CSSProperties = {};
  if (currentBanner.color) {
    if (
      currentBanner.color.startsWith("#") ||
      currentBanner.color.startsWith("rgb")
    ) {
      bgClass = "";
      customStyle.backgroundColor = currentBanner.color;
    } else {
      bgClass = currentBanner.color;
    }
  }

  const hasAction =
    currentBanner.action && currentBanner.action.type !== "none";

  return (
    <div
      className={`w-full relative z-40 flex items-center justify-center p-2 text-sm transition-all duration-300 ${bgClass} ${textClass} ${
        hasAction ? "cursor-pointer hover:opacity-95" : ""
      }`}
      style={customStyle}
      onClick={hasAction ? handleAction : undefined}
    >
      <div className="flex items-center w-full max-w-7xl mx-auto px-4 gap-4 justify-between">
        <div className="flex items-center flex-1 justify-center gap-3 w-full">
          {visibleBanners.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevBanner();
              }}
              className="p-1 hover:bg-black/10 rounded-full transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          <div className="text-center font-medium truncate max-w-2xl">
            {text}
          </div>

          {visibleBanners.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextBanner();
              }}
              className="p-1 hover:bg-black/10 rounded-full transition-colors shrink-0"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {currentBanner.isRemovable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="p-1 hover:bg-black/10 rounded-full transition-colors opacity-80 hover:opacity-100"
              aria-label="Dismiss banner"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

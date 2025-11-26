import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedLogo from "../../components/ui/AnimatedLogo";
import { bgGradient } from "../../constants/styles";
import { useTheme } from "../../context/ThemeContext";
import useScreen from "../../hooks/useScreen";
import { useUserStore } from "../../store/user";

export default function Nav({ children, sidebarLinks }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode, toggleMode } = useTheme();
  const sidebarRef = useRef(null);
  const { isMobile } = useScreen();
  const { user } = useUserStore();
  const activeRoute = location.pathname;

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

  return (
    <div className={`flex h-screen  `}>
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
            const isActive = activeRoute === link.path;
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
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-danger/20 text-danger hover:bg-danger/30">
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
          <div className="px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg transition-colors "
              >
                <span className="text-text-secondary">☰</span>
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={toggleMode}
                className="p-2 rounded-lg transition-colors  text-warning"
              >
                {mode === "dark" ? "☀️" : "🌙"}
              </button>

              <button className="relative p-2 rounded-lg transition-colors  text-text-secondary">
                <span>🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse" />
              </button>

              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-sm">JD</span>
              </div>
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

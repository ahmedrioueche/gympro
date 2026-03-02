import { Link, useMatches } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedLogo from "../../../components/ui/AnimatedLogo";

export interface NavbarColors {
  selectionFrom: string;
  selectionTo: string;
  buttonFrom: string;
  buttonTo: string;
  logoFrom: string;
  logoTo: string;
  glowColor: string;
}

const DEFAULT_COLORS: NavbarColors = {
  selectionFrom: "from-primary",
  selectionTo: "to-purple-500",
  buttonFrom: "from-primary",
  buttonTo: "to-purple-600",
  logoFrom: "from-primary",
  logoTo: "to-secondary",
  glowColor: "rgba(19, 91, 236, 0.4)",
};

const NAV_LINKS = [
  { labelKey: "landing.nav.home", to: "/landing" },
  { labelKey: "landing.nav.manager", to: "/landing/manager" },
  { labelKey: "landing.nav.member", to: "/landing/member" },
  { labelKey: "landing.nav.coach", to: "/landing/coach" },
] as const;

function LandingNavbar({ colors = DEFAULT_COLORS }: { colors?: NavbarColors }) {
  const { t } = useTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const matches = useMatches();

  const currentPath = matches[matches.length - 1]?.fullPath ?? "/landing";

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [currentPath]);

  // Track scroll position
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to: string) => {
    if (to === "/landing")
      return currentPath === "/landing" || currentPath === "/landing/";
    return currentPath.startsWith(to);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 border-b ${
        scrolled
          ? "bg-landing-bg-dark/70 backdrop-blur-xl border-white/10 shadow-lg shadow-black/10"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto  px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <AnimatedLogo
          logoSize="w-11 h-11"
          textSize="text-xl"
          leftPosition="10%"
          gradientFrom={colors.logoFrom}
          gradientTo={colors.logoTo}
        />

        {/* Desktop Navigation — centered */}
        <div className="hidden md:flex items-center gap-10 font-primary font-medium absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative transition-all duration-300 ${
                isActive(link.to)
                  ? `text-transparent bg-clip-text bg-gradient-to-r ${colors.selectionFrom} ${colors.selectionTo}`
                  : "text-slate-400 hover:text-white"
              }`}
              style={
                isActive(link.to)
                  ? { textShadow: `0 0 15px ${colors.glowColor}` }
                  : undefined
              }
            >
              {t(link.labelKey)}
              {isActive(link.to) && (
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full bg-gradient-to-r ${colors.selectionFrom} ${colors.selectionTo}`}
                  style={{
                    boxShadow: `0 0 8px ${colors.glowColor}`,
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Sign Up Button */}
        <div className="hidden md:flex items-center">
          <Link
            to="/auth/signup"
            className={`px-7 py-2.5 text-sm font-bold bg-gradient-to-r ${colors.buttonFrom} ${colors.buttonTo} text-white rounded-full hover:scale-105 transition-all duration-300 active:scale-95 border border-white/10 font-primary`}
            style={{
              boxShadow: `0 0 20px ${colors.glowColor}, inset 0 0 12px rgba(255, 255, 255, 0.2)`,
              backdropFilter: "blur(8px)",
            }}
          >
            {t("landing.nav.signUp")}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-landing-bg-dark/95 backdrop-blur-xl border-t border-[#374151] px-6 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-3 rounded-xl text-sm font-medium font-primary transition-all duration-200 ${
                isActive(link.to)
                  ? `text-transparent bg-clip-text bg-gradient-to-r ${colors.selectionFrom} ${colors.selectionTo}`
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <div className="pt-3 mt-3 border-t border-white/10">
            <Link
              to="/auth/signup"
              className={`block text-center px-7 py-3 text-sm font-bold bg-gradient-to-r ${colors.buttonFrom} ${colors.buttonTo} text-white rounded-full border border-white/10 font-primary`}
              style={{
                boxShadow: `0 0 20px ${colors.glowColor}, inset 0 0 12px rgba(255, 255, 255, 0.2)`,
              }}
            >
              {t("landing.nav.signUp")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;

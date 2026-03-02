import { Outlet } from "@tanstack/react-router";
import { createContext, useContext, useState } from "react";
import LandingFooter from "../../components/landing/LandingFooter";
import type { NavbarColors } from "../../components/landing/LandingNavbar";
import LandingNavbar from "../../components/landing/LandingNavbar";

export interface LandingPageContext {
  setNavbarColors: (colors: NavbarColors) => void;
}

const LandingContext = createContext<LandingPageContext | null>(null);

export const useLanding = () => {
  const context = useContext(LandingContext);
  if (!context) throw new Error("useLanding must be used within a LandingPage");
  return context;
};

function LandingPage() {
  const [navbarColors, setNavbarColors] = useState<NavbarColors | undefined>();

  return (
    <div className="mesh-bg min-h-screen text-white flex flex-col">
      <LandingNavbar colors={navbarColors} />
      <main className="flex-1 flex flex-col">
        <LandingContext.Provider value={{ setNavbarColors }}>
          <Outlet />
        </LandingContext.Provider>
      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;

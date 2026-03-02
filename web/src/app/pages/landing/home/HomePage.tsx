import { useLayoutEffect } from "react";
import { LANDING_PAGE_CLASSES } from "../../../../constants/styles";
import { useLanding } from "../LandingPage";
import CoachBento from "./components/CoachBento";
import HeroSection from "./components/HeroSection";
import ManagerBento from "./components/ManagerBento";
import MemberBento from "./components/MemberBento";

function HomePage() {
  const { setNavbarColors } = useLanding();

  useLayoutEffect(() => {
    setNavbarColors({
      selectionFrom: "from-primary",
      selectionTo: "to-purple-500",
      buttonFrom: "from-primary",
      buttonTo: "to-purple-600",
      logoFrom: "from-primary",
      logoTo: "to-secondary",
      glowColor: "rgba(19, 91, 236, 0.4)",
    });
  }, [setNavbarColors]);
  return (
    <>
      <HeroSection />

      {/* Bento sections */}
      <div className={LANDING_PAGE_CLASSES}>
        <ManagerBento />
        <MemberBento />
        <CoachBento />
      </div>
    </>
  );
}

export default HomePage;

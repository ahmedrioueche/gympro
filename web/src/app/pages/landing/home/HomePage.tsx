import { useLayoutEffect } from "react";
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
      <div className="relative z-10 px-6 mt-12 md:mt-24  md:px-10 pb-20 md:pb-40 flex flex-col gap-24 md:gap-24 lg:gap-40">
        <ManagerBento />
        <MemberBento />
        <CoachBento />
      </div>
    </>
  );
}

export default HomePage;

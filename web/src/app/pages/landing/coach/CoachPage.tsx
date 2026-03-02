import { useLayoutEffect } from "react";
import { LANDING_PAGE_CLASSES } from "../../../../constants/styles";
import { useLanding } from "../LandingPage";
import { CoachCTA } from "./components/CoachCTA";
import { CoachDashboard } from "./components/CoachDashboard";
import { CoachFeatures } from "./components/CoachFeatures";
import { CoachHero } from "./components/CoachHero";

function CoachPage() {
  const { setNavbarColors } = useLanding();

  useLayoutEffect(() => {
    setNavbarColors({
      selectionFrom: "from-[#0dccf2]",
      selectionTo: "to-[#34d3ee]",
      buttonFrom: "from-[#0dccf2]",
      buttonTo: "to-[#34d3ee]",
      logoFrom: "from-[#0dccf2]",
      logoTo: "to-[#34d3ee]",
      glowColor: "rgba(13, 204, 242, 0.4)",
    });
  }, [setNavbarColors]);
  return (
    <>
      <CoachHero />

      <div className={LANDING_PAGE_CLASSES}>
        <CoachDashboard />
        <CoachFeatures />
        <CoachCTA />
      </div>
    </>
  );
}

export default CoachPage;

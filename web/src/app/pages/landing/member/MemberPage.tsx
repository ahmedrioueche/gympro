import { useLayoutEffect } from "react";
import { LANDING_PAGE_CLASSES } from "../../../../constants/styles";
import { useLanding } from "../LandingPage";
import { MemberFeatures } from "./components/MemberFeatures";
import { MemberHero } from "./components/MemberHero";
import { WorkoutPreview } from "./components/WorkoutPreview";

function MemberPage() {
  const { setNavbarColors } = useLanding();

  useLayoutEffect(() => {
    setNavbarColors({
      selectionFrom: "from-secondary",
      selectionTo: "to-purple-400",
      buttonFrom: "from-secondary",
      buttonTo: "to-purple-500",
      logoFrom: "from-secondary",
      logoTo: "to-purple-400",
      glowColor: "rgba(118, 83, 224, 0.4)",
    });
  }, [setNavbarColors]);
  return (
    <>
      <MemberHero />

      <div className={LANDING_PAGE_CLASSES}>
        <MemberFeatures />
        <WorkoutPreview />
      </div>
    </>
  );
}

export default MemberPage;

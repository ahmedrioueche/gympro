import { useLayoutEffect } from "react";
import { LANDING_PAGE_CLASSES } from "../../../../constants/styles";
import { useLanding } from "../LandingPage";
import { FinancialsGrowth } from "./components/FinancialsGrowth";
import { ManagerCTA } from "./components/ManagerCTA";
import { ManagerHero } from "./components/ManagerHero";
import { ManagerTestimonials } from "./components/ManagerTestimonials";
import { MemberLifecycle } from "./components/MemberLifecycle";
import { OperationsStaff } from "./components/OperationsStaff";

function ManagerPage() {
  const { setNavbarColors } = useLanding();

  useLayoutEffect(() => {
    setNavbarColors({
      selectionFrom: "from-primary",
      selectionTo: "to-blue-400",
      buttonFrom: "from-primary",
      buttonTo: "to-blue-500",
      logoFrom: "from-primary",
      logoTo: "to-blue-400",
      glowColor: "rgba(77, 151, 242, 0.4)",
    });
  }, [setNavbarColors]);
  return (
    <>
      <ManagerHero />

      <div className={LANDING_PAGE_CLASSES}>
        <MemberLifecycle />
        <FinancialsGrowth />
        <OperationsStaff />
        <ManagerTestimonials />
        <ManagerCTA />
      </div>
    </>
  );
}

export default ManagerPage;

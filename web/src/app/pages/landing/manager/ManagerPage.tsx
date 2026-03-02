import { useLayoutEffect } from "react";
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
      <main className="flex-1">
        <ManagerHero />
        <MemberLifecycle />
        <FinancialsGrowth />
        <OperationsStaff />
        <ManagerTestimonials />
        <ManagerCTA />
      </main>
    </>
  );
}

export default ManagerPage;

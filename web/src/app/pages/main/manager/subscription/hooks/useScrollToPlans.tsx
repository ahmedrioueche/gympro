import { useEffect } from "react";

export function useScrollToPlans() {
  useEffect(() => {
    if (window.location.hash === "#plans-section") {
      const plansSection = document.getElementById("plans-section");
      if (plansSection) {
        plansSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);
}

import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { LANDING_PAGE_CLASSES } from "../../../../constants/styles";
import RoleCTA from "../../../components/landing/RoleCTA";
import RoleSection from "../../../components/landing/RoleSection";
import ManagerVisual from "../../../components/landing/visuals/ManagerVisual";
import { getManagerFeatures } from "../landingData";
import { useLanding } from "../LandingPage";
import { FinancialsGrowth } from "./components/FinancialsGrowth";
import { ManagerHero } from "./components/ManagerHero";
import { MemberLifecycle } from "./components/MemberLifecycle";
import { OperationsStaff } from "./components/OperationsStaff";

function ManagerPage() {
  const { setNavbarColors } = useLanding();
  const { t } = useTranslation();

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

  const managerFeatures = getManagerFeatures(t);

  return (
    <>
      <ManagerHero />

      <div className={LANDING_PAGE_CLASSES}>
        <RoleSection
          title={t("landing.roleSections.manager.title")}
          subtitle={t("landing.roleSections.manager.subtitle")}
          primaryColor="#4d97f2"
          secondaryColor="#7f0df2"
          accentColor="#22d3ee"
          visual={
            <ManagerVisual
              primaryColor="#4d97f2"
              secondaryColor="#7f0df2"
              accentColor="#22d3ee"
            />
          }
          features={managerFeatures}
        />

        <MemberLifecycle />
        <FinancialsGrowth />
        <OperationsStaff />

        <RoleCTA
          title={
            <>
              {t("landing.roleSections.manager.cta.titlePart1")}{" "}
              <span className="text-primary">
                {t("landing.roleSections.manager.cta.titlePart2")}
              </span>
            </>
          }
          description={t("landing.roleSections.manager.cta.subtitle")}
          buttonText={t("landing.roleSections.manager.cta.button")}
          primaryColor="#4d97f2"
          glowColor="rgba(77, 151, 242, 0.4)"
        />
      </div>
    </>
  );
}

export default ManagerPage;

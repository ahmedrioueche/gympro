import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { LANDING_PAGE_CLASSES } from "../../../../constants/styles";
import RoleCTA from "../../../components/landing/RoleCTA";
import RoleSection from "../../../components/landing/RoleSection";
import CoachVisual from "../../../components/landing/visuals/CoachVisual";
import { getCoachFeatures } from "../landingData";
import { useLanding } from "../LandingPage";
import { CoachDashboard } from "./components/CoachDashboard";
import { CoachFeatures } from "./components/CoachFeatures";
import { CoachHero } from "./components/CoachHero";

function CoachPage() {
  const { setNavbarColors } = useLanding();
  const { t } = useTranslation();

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

  const coachFeatures = getCoachFeatures(t);

  return (
    <>
      <CoachHero />

      <div className={LANDING_PAGE_CLASSES}>
        <RoleSection
          title={t("landing.roleSections.coach.title")}
          subtitle={t("landing.roleSections.coach.subtitle")}
          primaryColor="#0dccf2"
          secondaryColor="#34d3ee"
          accentColor="#10b981"
          visual={
            <CoachVisual
              primaryColor="#0dccf2"
              secondaryColor="#34d3ee"
              accentColor="#10b981"
            />
          }
          features={coachFeatures}
        />

        <CoachDashboard />
        <CoachFeatures />

        <RoleCTA
          title={
            <>
              {t("landing.roleSections.coach.cta.titlePart1")}{" "}
              <span className="text-[#0dccf2]">
                {t("landing.roleSections.coach.cta.titlePart2")}
              </span>
            </>
          }
          description={t("landing.roleSections.coach.cta.subtitle")}
          buttonText={t("landing.roleSections.coach.cta.button")}
          primaryColor="#0dccf2"
          glowColor="rgba(13, 204, 242, 0.4)"
        />
      </div>
    </>
  );
}

export default CoachPage;

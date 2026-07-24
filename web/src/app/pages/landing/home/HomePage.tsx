import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { LANDING_PAGE_CLASSES } from "../../../../constants/styles";
import RoleCTA from "../../../components/landing/RoleCTA";
import RoleSection from "../../../components/landing/RoleSection";
import CoachVisual from "../../../components/landing/visuals/CoachVisual";
import ManagerVisual from "../../../components/landing/visuals/ManagerVisual";
import MemberVisual from "../../../components/landing/visuals/MemberVisual";
import {
  getCoachFeatures,
  getManagerFeatures,
  getMemberFeatures,
} from "../landingData";
import { useLanding } from "../LandingPage";
import CoachBento from "./components/CoachBento";
import HeroSection from "./components/HeroSection";
import ManagerBento from "./components/ManagerBento";
import MemberBento from "./components/MemberBento";

function HomePage() {
  const { setNavbarColors } = useLanding();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    setNavbarColors({
      selectionFrom: "from-primary",
      selectionTo: "to-primary",
      buttonFrom: "from-primary",
      buttonTo: "to-primary",
      logoFrom: "from-primary",
      logoTo: "to-primary",
      glowColor: "rgba(19, 91, 236, 0.4)",
    });
  }, [setNavbarColors]);

  const managerFeatures = getManagerFeatures(t);
  const memberFeatures = getMemberFeatures(t);
  const coachFeatures = getCoachFeatures(t);

  return (
    <>
      <HeroSection />

      {/* Bento sections */}
      <div className={LANDING_PAGE_CLASSES}>
        <ManagerBento />

        {/* Manager Role Section */}
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
        <MemberBento />

        {/* Member Section */}
        <RoleSection
          title={t("landing.roleSections.member.title")}
          subtitle={t("landing.roleSections.member.subtitle")}
          primaryColor="#f97316"
          secondaryColor="#ef4444"
          accentColor="#fbbf24"
          visual={
            <MemberVisual
              primaryColor="#f97316"
              secondaryColor="#ef4444"
              accentColor="#fbbf24"
            />
          }
          features={memberFeatures}
        />

        <CoachBento />

        {/* Coach Section */}
        <RoleSection
          title={t("landing.roleSections.coach.title")}
          subtitle={t("landing.roleSections.coach.subtitle")}
          primaryColor="#06b6d4"
          secondaryColor="#10b981"
          accentColor="#22d3ee"
          visual={
            <CoachVisual
              primaryColor="#06b6d4"
              secondaryColor="#10b981"
              accentColor="#22d3ee"
            />
          }
          features={coachFeatures}
        />

        {/* Final General CTA */}
        <RoleCTA
          title={
            <>
              {t("landing.roleSections.general.cta.titlePart1")}{" "}
              <span className="text-primary">
                {t("landing.roleSections.general.cta.titlePart2")}
              </span>
            </>
          }
          description={t("landing.roleSections.general.cta.subtitle")}
          buttonText={t("landing.roleSections.general.cta.button")}
          primaryColor="#4d97f2"
          glowColor="rgba(19, 91, 236, 0.4)"
          accentColor="#7653e0"
        />
      </div>

      <div className="py-20" />
    </>
  );
}

export default HomePage;

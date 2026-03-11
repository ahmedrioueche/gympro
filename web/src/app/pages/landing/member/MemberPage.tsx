import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { LANDING_PAGE_CLASSES } from "../../../../constants/styles";
import RoleCTA from "../../../components/landing/RoleCTA";
import RoleSection from "../../../components/landing/RoleSection";
import MemberVisual from "../../../components/landing/visuals/MemberVisual";
import { getMemberFeatures } from "../landingData";
import { useLanding } from "../LandingPage";
import { MemberFeatures } from "./components/MemberFeatures";
import { MemberHero } from "./components/MemberHero";
import { WorkoutPreview } from "./components/WorkoutPreview";

function MemberPage() {
  const { setNavbarColors } = useLanding();
  const { t } = useTranslation();

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

  const memberFeatures = getMemberFeatures(t);

  return (
    <>
      <MemberHero />

      <div className={LANDING_PAGE_CLASSES}>
        <RoleSection
          title={t("landing.roleSections.member.title")}
          subtitle={t("landing.roleSections.member.subtitle")}
          primaryColor="#7653e0"
          secondaryColor="#a78bfa"
          accentColor="#fbbf24"
          visual={
            <MemberVisual
              primaryColor="#7653e0"
              secondaryColor="#a78bfa"
              accentColor="#fbbf24"
            />
          }
          features={memberFeatures}
        />

        <MemberFeatures />
        <WorkoutPreview />

        <RoleCTA
          title={
            <>
              {t("landing.roleSections.member.cta.titlePart1")}{" "}
              <span className="text-secondary">
                {t("landing.roleSections.member.cta.titlePart2")}
              </span>
            </>
          }
          description={t("landing.roleSections.member.cta.subtitle")}
          buttonText={t("landing.roleSections.member.cta.button")}
          primaryColor="#7653e0"
          glowColor="rgba(118, 83, 224, 0.4)"
        />
      </div>
    </>
  );
}

export default MemberPage;

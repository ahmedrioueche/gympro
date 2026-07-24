import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanding } from "../LandingPage";
import { LandingLegalPage } from "./LandingLegalPage";

export default function PrivacyPage() {
  const { t } = useTranslation();
  const { setNavbarColors } = useLanding();

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

  const sections = [
    {
      title: t("landing.legal.privacy.sections.collect.title"),
      content: t("landing.legal.privacy.sections.collect.content"),
    },
    {
      title: t("landing.legal.privacy.sections.usage.title"),
      content: t("landing.legal.privacy.sections.usage.content"),
    },
    {
      title: t("landing.legal.privacy.sections.sharing.title"),
      content: t("landing.legal.privacy.sections.sharing.content"),
    },
    {
      title: t("landing.legal.privacy.sections.security.title"),
      content: t("landing.legal.privacy.sections.security.content"),
    },
    {
      title: t("landing.legal.privacy.sections.rights.title"),
      content: t("landing.legal.privacy.sections.rights.content"),
    },
  ];

  return (
    <LandingLegalPage
      title={t("landing.legal.privacy.title")}
      subtitle={t("landing.legal.privacy.subtitle")}
      intro={t("landing.legal.privacy.intro")}
      sections={sections}
    />
  );
}

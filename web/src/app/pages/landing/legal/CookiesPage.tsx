import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanding } from "../LandingPage";
import { LandingLegalPage } from "./LandingLegalPage";

export default function CookiesPage() {
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
      title: t("landing.legal.cookies.sections.what.title"),
      content: t("landing.legal.cookies.sections.what.content"),
    },
    {
      title: t("landing.legal.cookies.sections.why.title"),
      content: t("landing.legal.cookies.sections.why.content"),
    },
    {
      title: t("landing.legal.cookies.sections.types.title"),
      content: t("landing.legal.cookies.sections.types.content"),
    },
    {
      title: t("landing.legal.cookies.sections.control.title"),
      content: t("landing.legal.cookies.sections.control.content"),
    },
  ];

  return (
    <LandingLegalPage
      title={t("landing.legal.cookies.title")}
      subtitle={t("landing.legal.cookies.subtitle")}
      intro={t("landing.legal.cookies.intro")}
      sections={sections}
    />
  );
}

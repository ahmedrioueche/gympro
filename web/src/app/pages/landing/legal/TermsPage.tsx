import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanding } from "../LandingPage";
import { LandingLegalPage } from "./LandingLegalPage";

export default function TermsPage() {
  const { t } = useTranslation();
  const { setNavbarColors } = useLanding();

  useLayoutEffect(() => {
    setNavbarColors({
      selectionFrom: "from-primary",
      selectionTo: "to-purple-500",
      buttonFrom: "from-primary",
      buttonTo: "to-purple-600",
      logoFrom: "from-primary",
      logoTo: "to-secondary",
      glowColor: "rgba(19, 91, 236, 0.4)",
    });
  }, [setNavbarColors]);

  const sections = [
    {
      title: t("landing.legal.terms.sections.use.title"),
      content: t("landing.legal.terms.sections.use.content"),
    },
    {
      title: t("landing.legal.terms.sections.accounts.title"),
      content: t("landing.legal.terms.sections.accounts.content"),
    },
    {
      title: t("landing.legal.terms.sections.billing.title"),
      content: t("landing.legal.terms.sections.billing.content"),
    },
    {
      title: t("landing.legal.terms.sections.privacy.title"),
      content: t("landing.legal.terms.sections.privacy.content"),
    },
    {
      title: t("landing.legal.terms.sections.liability.title"),
      content: t("landing.legal.terms.sections.liability.content"),
    },
  ];

  return (
    <LandingLegalPage
      title={t("landing.legal.terms.title")}
      subtitle={t("landing.legal.terms.subtitle")}
      intro={t("landing.legal.terms.intro")}
      sections={sections}
    />
  );
}

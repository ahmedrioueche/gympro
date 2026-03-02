import { APP_DATA } from "@ahmedrioueche/gympro-client";
import { Link } from "@tanstack/react-router";
import { Dumbbell, Facebook, Github, Instagram, Twitter } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function LandingFooter() {
  const { t } = useTranslation();

  const featureLinks = [
    { label: t("landing.footer.features.managers"), href: "/landing/manager" },
    { label: t("landing.footer.features.members"), href: "/landing/member" },
    { label: t("landing.footer.features.coaches"), href: "/landing/coach" },
  ];

  const legalLinks = [
    { label: t("landing.footer.legal.terms"), href: "/landing/terms" },
    { label: t("landing.footer.legal.privacy"), href: "/landing/privacy" },
    { label: t("landing.footer.legal.cookies"), href: "/landing/cookies" },
  ];

  const supportLinks = [
    {
      label: t("landing.footer.support.contact"),
      href: `mailto:${APP_DATA.email}`,
    },
  ];

  const socialIcons: Record<string, any> = {
    twitter: Twitter,
    instagram: Instagram,
    facebook: Facebook,
    github: Github,
  };

  const socials = useMemo(() => {
    if (!APP_DATA.social) return [];
    return Object.entries(APP_DATA.social)
      .filter(([_, url]) => !!url)
      .map(([key, url]) => ({
        icon: socialIcons[key] || Github,
        href: url as string,
        label: key.charAt(0).toUpperCase() + key.slice(1),
      }));
  }, [APP_DATA.social]);

  return (
    <footer className="border-t border-white/10 pt-20 md:pt-40 pb-10 md:pb-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12 relative z-10">
        {/* Brand column */}
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-4 md:mb-6">
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Dumbbell className="w-4.5 h-4.5 text-primary" />
            </div>
            <h4 className="text-white font-black text-xl md:text-2xl">
              {t("landing.footer.brand")}
            </h4>
          </div>
          <p className="text-slate-500 max-w-sm mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
            {t("landing.footer.description")}
          </p>
          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 text-slate-400 hover:text-primary"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Features links */}
        <div>
          <h5 className="text-white font-bold mb-4 md:mb-6 text-sm">
            {t("landing.footer.featuresTitle")}
          </h5>
          <ul className="flex flex-col gap-3 text-slate-500 text-sm font-medium">
            {featureLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href as any}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal links */}
        <div>
          <h5 className="text-white font-bold mb-4 md:mb-6 text-sm">
            {t("landing.footer.legalTitle")}
          </h5>
          <ul className="flex flex-col gap-3 text-slate-500 text-sm font-medium">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href as any}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support links */}
        <div>
          <h5 className="text-white font-bold mb-4 md:mb-6 text-sm">
            {t("landing.footer.supportTitle")}
          </h5>
          <ul className="flex flex-col gap-3 text-slate-500 text-sm font-medium">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Giant background text */}
      <div className="absolute -bottom-20 left-0 w-full flex justify-center opacity-[0.03] select-none pointer-events-none">
        <h2 className="text-[30vw] font-black tracking-tighter uppercase leading-none">
          {APP_DATA.name.toUpperCase()}
        </h2>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-20 md:mt-40 pt-6 md:pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 gap-4">
        <span>
          © {new Date().getFullYear()} {APP_DATA.name}. All rights reserved
        </span>
        <div className="flex gap-6 flex-wrap justify-center text-slate-600">
          <Link
            to="/landing/terms"
            className="hover:text-slate-400 transition-colors"
          >
            {t("landing.footer.legal.terms")}
          </Link>
          <Link
            to="/landing/privacy"
            className="hover:text-slate-400 transition-colors"
          >
            {t("landing.footer.legal.privacy")}
          </Link>
          <Link
            to="/landing/cookies"
            className="hover:text-slate-400 transition-colors"
          >
            {t("landing.footer.legal.cookies")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;

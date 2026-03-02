import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useInView } from "../../../../hooks/useInView";

interface LegalSection {
  title: string;
  content: string;
}

interface LandingLegalPageProps {
  title: string;
  subtitle: string;
  intro: string;
  sections: LegalSection[];
}

export function LandingLegalPage({
  title,
  subtitle,
  intro,
  sections,
}: LandingLegalPageProps) {
  const { ref: headerRef, inView: headerInView } = useInView(0.1);

  return (
    <div className="min-h-screen bg-landing-bg-dark pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <header
          ref={headerRef as React.RefObject<HTMLElement>}
          className="mb-16 hero-animate"
          style={{
            animation: headerInView
              ? "heroFadeUp 0.8s ease-out forwards"
              : "none",
            opacity: headerInView ? 1 : 0,
          }}
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-primary font-bold tracking-wider uppercase text-sm mb-8">
            {subtitle}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-600 rounded-full mb-12" />
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl">
            {intro}
          </p>
        </header>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <LegalSectionComponent
              key={index}
              section={section}
              index={index}
            />
          ))}
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 text-slate-500 text-sm">
          <p>
            If you have any questions about these documents, please contact us
            at support@gympro.com
          </p>
        </footer>
      </div>
    </div>
  );
}

function LegalSectionComponent({
  section,
  index,
}: {
  section: LegalSection;
  index: number;
}) {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="glass-card p-8 rounded-3xl border-white/5 hover:border-white/10 transition-colors hero-animate"
      style={{
        animation: inView
          ? `heroFadeUp 0.6s ease-out ${0.1 + index * 0.05}s forwards`
          : "none",
        opacity: inView ? 1 : 0,
      }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
      <p className="text-slate-400 leading-relaxed">{section.content}</p>
    </section>
  );
}

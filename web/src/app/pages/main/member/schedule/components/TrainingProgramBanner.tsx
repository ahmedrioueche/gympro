import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";

interface TrainingProgramBannerProps {
  activeProgram: any;
}

export const TrainingProgramBanner = ({
  activeProgram,
}: TrainingProgramBannerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!activeProgram) return null;

  return (
    <div className="space-y-5 mt-16">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
        <h2 className="text-xl font-bold text-white">
          {t("pages.member.programs")}
        </h2>
      </div>
      <div className="relative overflow-hidden bg-surface backdrop-blur-md border border-white/10 rounded-3xl p-8 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-emerald-500/20 transition-all duration-500" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider mb-4">
              {t("common.active", "Active Program")}
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">
              {activeProgram.program.name}
            </h3>
            <p className="text-white/60 max-w-xl">
              {activeProgram.program.description}
            </p>
          </div>

          <button
            onClick={() => navigate({ to: APP_PAGES.member.training.link })}
            className="flex items-center gap-2 px-6 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            <span>{t("common.viewTraining")}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

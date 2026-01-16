import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import BackButton from "../../../../../components/ui/BackButton";
import Loading from "../../../../../components/ui/Loading";
import { CoachHero } from "./components/CoachHero";
import { useCoachProfile } from "./hooks/useCoachProfile";

function CoachProfilePage() {
  const { t } = useTranslation();
  const params = useParams({ strict: false });
  const coachId = (params as any)?.coachId;
  const { data: coach, isLoading, error } = useCoachProfile(coachId);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !coach) {
    return (
      <div className="text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-16 shadow-2xl">
          <div className="text-8xl mb-8">🔍</div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">
            {t("coachProfile.notFound")}
          </h3>
          <p className="text-zinc-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
            {t("coachProfile.notFoundDesc")}
          </p>
          <BackButton onClick={() => window.history.back()} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="z-10 hidden sm:block mb-6">
        <BackButton label={t("common.goBack")} />
      </div>

      <div className="space-y-12">
        <CoachHero coach={coach} />
      </div>
    </div>
  );
}

export default CoachProfilePage;

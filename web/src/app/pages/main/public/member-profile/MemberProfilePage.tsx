import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import BackButton from "../../../../../components/ui/BackButton";
import Loading from "../../../../../components/ui/Loading";
import { UserProfileAbout } from "./components/UserProfileAbout";
import { UserProfileHero } from "./components/UserProfileHero";
import { useUserProfile } from "./hooks/useUserProfile";

function MemberProfilePage() {
  const { t } = useTranslation();
  const params = useParams({ strict: false });
  const userId = (params as any)?.userId;

  const { data: user, isLoading, error } = useUserProfile(userId);

  if (isLoading) {
    return <Loading className="items-center justify-center " />;
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-16 shadow-2xl text-center max-w-md w-full">
          <div className="text-8xl mb-8">🔍</div>
          <h3 className="text-3xl font-black text-text-primary mb-4 tracking-tighter">
            {t("memberProfile.notFound", "User Not Found")}
          </h3>
          <p className="text-text-secondary mb-10 text-lg leading-relaxed">
            {t(
              "memberProfile.notFoundDesc",
              "The user you are looking for does not exist or you do not have permission to view them."
            )}
          </p>
          <BackButton onClick={() => window.history.back()} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="z-10 mb-8">
        <BackButton label={t("common.goBack", "Go Back")} />
      </div>

      <div className="space-y-8">
        {/* User Hero Section */}
        <UserProfileHero user={user} />

        {/* About & Stats Section */}
        <UserProfileAbout user={user} />
      </div>
    </div>
  );
}

export default MemberProfilePage;

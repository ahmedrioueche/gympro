import { useNavigate, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import BackButton from "../../../../../../components/ui/BackButton";
import Loading from "../../../../../../components/ui/Loading";
import { useGymStore } from "../../../../../../store/gym";
import { MemberHero } from "./components/MemberHero";
import { MemberSubscriptionsTable } from "./components/MemberSubscriptionsTable";
import { useMemberProfile } from "./hooks/useMemberProfile";

function MemberProfilePage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const params = useParams({ strict: false });
  const membershipId = (params as any)?.membershipId;
  const navigate = useNavigate();
  const { data, isLoading, error } = useMemberProfile(
    currentGym?._id,
    membershipId
  );

  if (!currentGym) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-500 font-medium">{t("gym.no_gym_selected")}</p>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data) {
    return (
      <div className="text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-16 shadow-2xl">
          <div className="text-8xl mb-8">🔍</div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">
            {t("memberProfile.notFound")}
          </h3>
          <p className="text-zinc-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
            {t("memberProfile.notFoundDesc")}
          </p>
          <BackButton onClick={() => window.history.back()} />
        </div>
      </div>
    );
  }

  const profile = data;

  const filteredHistory =
    profile.user.subscriptionHistory?.filter((h) => {
      // Handle both populated gym object and string ID
      const gymId = typeof h.gym === "string" ? h.gym : h.gym?._id;
      return gymId === currentGym?._id;
    }) || [];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="z-10 hidden sm:block mb-6">
        <BackButton label={t("common.goBack")} />
      </div>

      <div className="space-y-12">
        {/* Main Hero Card */}
        <MemberHero
          user={profile.user}
          joinedAt={profile.membership.joinedAt}
          membershipId={profile.membership._id}
          subscription={profile.membership.subscription}
          subscriptionType={profile.subscriptionType}
        />

        {/* Payment History Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div>
              <h2 className="text-2xl font-black text-white">
                {t(
                  "memberProfile.subscription.historyTitle",
                  "Subscription History"
                )}
              </h2>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl">
            <MemberSubscriptionsTable history={filteredHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberProfilePage;

import { useTranslation } from "react-i18next";
import NotFound from "../../../../../../components/ui/NotFound";
import { useGymSubscriptionTypes } from "../../../../../../hooks/useGymSubscriptionTypes";
import { useGymStore } from "../../../../../../store/gym";
import GymHeroSection from "../../../../../components/gym/GymHeroSection";
import MarketingCarousel from "../../../../../components/gym/MarketingCarousel";
import OperatingHours from "../../../../../components/gym/OperatingHours";
import AnnouncementsCard from "./components/AnnouncementsCard";
import { MemberPricingCard } from "./components/MemberPricingCard";
import { useGymAnnouncements } from "./hooks/useGymAnnouncements";
import { useGymMemberHome } from "./hooks/useGymMemberHome";

function HomePage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const status = useGymMemberHome(currentGym?.settings);
  const { data: announcements = [], isLoading: announcementsLoading } =
    useGymAnnouncements(currentGym?._id);

  const { data: plans = [], isLoading: plansLoading } =
    useGymSubscriptionTypes();

  if (!currentGym) {
    return <NotFound />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col gap-6 pb-8">
      <GymHeroSection gym={currentGym} status={status} />
      <MarketingCarousel gym={currentGym} />

      {/* Bottom Grid - Using specialized components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 mb-4">
        {/* Left: Operating Hours */}
        <OperatingHours settings={currentGym.settings} status={status} />

        {/* Right: Announcements */}
        <AnnouncementsCard
          announcements={announcements}
          isLoading={announcementsLoading}
        />
      </div>

      {/* Plans Section - Elevated Section */}
      {plans.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 px-2">
            <h3 className="text-2xl font-[1000] text-text-primary tracking-tight">
              {t("home.gymMember.plans.title", "Subscription Plans")}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans
              .filter((p) => p.isAvailable)
              .map((plan) => (
                <MemberPricingCard key={plan._id} plan={plan} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;

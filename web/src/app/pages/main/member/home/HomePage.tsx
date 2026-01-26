import { useNavigate } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/ui/Button";
import { APP_PAGES } from "../../../../../constants/navigation";
import ProfileHeader from "../../../../components/templates/profile-header/ProfileHeader";
import { MemberHomeStats } from "./components/MemberHomeStats";
import { MemberQuickActions } from "./components/MemberQuickActions";
import { useMemberHome } from "./hooks/useMemberHome";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, subscription, stats } = useMemberHome();

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <ProfileHeader
        user={user}
        subscription={subscription}
        action={
          <Button
            onClick={() => navigate({ to: APP_PAGES.member.settings.link })}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-11 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
          >
            {t("home.member.profile.editProfile")}
            <Pencil className="w-4 h-4" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats */}
        <div className="lg:col-span-1 space-y-6">
          <MemberHomeStats stats={stats} />
        </div>

        {/* Right Column - Quick Actions & Content */}
        <div className="lg:col-span-2 space-y-6">
          <MemberQuickActions />
        </div>
      </div>
    </div>
  );
}

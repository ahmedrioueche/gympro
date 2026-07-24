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
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-11 text-sm font-semibold text-white bg-primary hover:bg-primary/80 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
          >
            {t("home.member.profile.editProfile")}
            <Pencil className="w-4 h-4" />
          </Button>
        }
      />

      <div className="space-y-8">
        <div className="space-y-4">
          <MemberHomeStats stats={stats} />
        </div>
        <div className="space-y-4">
          <MemberQuickActions />
        </div>
      </div>
    </div>
  );
}

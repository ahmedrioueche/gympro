import { type User } from "@ahmedrioueche/gympro-client";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import BackButton from "../../../../components/ui/BackButton";
import Loading from "../../../../components/ui/Loading";
import { ProfileHero } from "./components/ProfileHero";

interface MemberProfileTemplateProps {
  user?: User;
  isLoading: boolean;
  error?: Error | null;
  heroRightContent?: ReactNode; // For Subscription Card
  extraContent?: ReactNode; // For Tabs (Billing, Notes, etc.)
  onBack?: () => void;
}

export function MemberProfileTemplate({
  user,
  isLoading,
  error,
  heroRightContent,
  extraContent,
  onBack,
}: MemberProfileTemplateProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <Loading />;
  }

  if (error || !user) {
    return (
      <div className="text-center py-20">
        <div className="bg-surface border border-border rounded-[40px] p-16 shadow-2xl max-w-2xl mx-auto">
          <div className="text-8xl mb-8">🔍</div>
          <h3 className="text-3xl font-black text-text-primary mb-4 tracking-tighter">
            {t("memberProfile.notFound")}
          </h3>
          <p className="text-text-secondary max-w-md mx-auto mb-10 text-lg leading-relaxed">
            {t("memberProfile.notFoundDesc")}
          </p>
          <BackButton onClick={onBack || (() => window.history.back())} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      <div className="z-10 hidden sm:block">
        <BackButton onClick={onBack} label="Go Back" />
      </div>

      <ProfileHero
        user={user}
        joinedAt={user.createdAt as string}
        rightContent={heroRightContent}
      />

      {extraContent}
    </div>
  );
}

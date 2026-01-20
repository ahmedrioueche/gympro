import { type User } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Calendar, Mail, Phone, User as UserIcon } from "lucide-react";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { openGmail, openWhatsApp } from "../../../../../utils/contact";

interface ProfileHeroProps {
  user: User;
  joinedAt?: string;
  rightContent?: ReactNode; // Slot for SubscriptionCard, Stats, etc.
}

export function ProfileHero({
  user,
  joinedAt,
  rightContent,
}: ProfileHeroProps) {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden bg-surface border border-border rounded-3xl">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20 opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full -ml-20 -mb-20 opacity-30" />

      <div className="relative p-8">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
          {/* Left Section: Profile Info */}
          <div className="flex gap-6 items-start">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {user.profile?.profileImageUrl ? (
                <img
                  src={user.profile.profileImageUrl}
                  alt={user.profile.fullName || ""}
                  className="w-28 h-28 rounded-2xl object-cover ring-2 ring-border shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 bg-surface-hover flex items-center justify-center rounded-2xl ring-2 ring-border shadow-lg">
                  <UserIcon className="w-14 h-14 text-text-secondary" />
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Name & Basic Info */}
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-3">
                  {user.profile?.fullName || t("memberProfile.unknownMember")}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-surface-hover text-text-secondary text-xs font-semibold uppercase tracking-wider rounded-lg border border-border">
                    {user.profile?.gender ||
                      t("memberProfile.genderNotSpecified")}
                  </span>
                  <span className="px-3 py-1 bg-surface-hover text-text-secondary text-xs font-semibold uppercase tracking-wider rounded-lg border border-border">
                    {user.profile?.age || "?"} {t("common.years")}
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-lg border border-primary/20">
                    ID: {user._id.slice(-8)}
                  </span>
                </div>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 gap-3">
                <div
                  onClick={() =>
                    user.profile.email && openGmail(user.profile.email)
                  }
                  className="flex items-center gap-3 text-text-secondary group/link cursor-pointer hover:text-primary transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center group-hover/link:bg-primary/10 border border-border group-hover/link:border-primary/30 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">
                    {user.profile.email || t("memberProfile.noEmail")}
                  </span>
                </div>

                <div
                  onClick={() =>
                    user.profile.phoneNumber &&
                    openWhatsApp(user.profile.phoneNumber)
                  }
                  className="flex items-center gap-3 text-text-secondary group/link cursor-pointer hover:text-primary transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center group-hover/link:bg-primary/10 border border-border group-hover/link:border-primary/30 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {user.profile.phoneNumber || t("memberProfile.noPhone")}
                  </span>
                </div>

                {joinedAt && (
                  <div className="flex items-center gap-3 text-text-secondary">
                    <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {t("memberProfile.joinedAt")}{" "}
                      {format(new Date(joinedAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section: Injected Content (Subscription Card, etc.) */}
          {rightContent && (
            <div className="w-full lg:w-[380px]">{rightContent}</div>
          )}
        </div>
      </div>
    </div>
  );
}

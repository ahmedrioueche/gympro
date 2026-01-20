import { type User } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Activity, Calendar, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserProfileAboutProps {
  user: User;
}

export function UserProfileAbout({ user }: UserProfileAboutProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Location */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6 flex flex-col items-center text-center hover:border-primary-500/30 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:bg-primary-500/10 group-hover:text-primary-400 text-text-secondary transition-colors">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-bold text-text-secondary mb-1 tracking-wider">
            {t("memberProfile.location", "Location")}
          </span>
          <span className="text-lg font-bold text-text-primary truncate max-w-full px-2">
            {user.profile?.city ||
              user.profile?.country ||
              t("common.notSpecified", "Not Specified")}
          </span>
        </div>

        {/* Join Date */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6 flex flex-col items-center text-center hover:border-primary-500/30 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:bg-primary-500/10 group-hover:text-primary-400 text-text-secondary transition-colors">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-bold text-text-secondary mb-1 tracking-wider">
            {t("memberProfile.memberSince", "Member Since")}
          </span>
          <span className="text-lg font-bold text-text-primary">
            {format(new Date(user.createdAt || Date.now()), "MMM yyyy")}
          </span>
        </div>

        {/* Activity / Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-6 flex flex-col items-center text-center hover:border-primary-500/30 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 text-text-secondary transition-colors">
            <Activity className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-bold text-text-secondary mb-1 tracking-wider">
            {t("memberProfile.status", "Status")}
          </span>
          <span className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            {t("common.active", "Active")}
          </span>
        </div>
      </div>
    </div>
  );
}

import { type User } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Calendar, Mail, Phone, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { openGmail, openWhatsApp } from "../../../../../../utils/contact";

interface UserProfileHeroProps {
  user: User;
}

export function UserProfileHero({ user }: UserProfileHeroProps) {
  const { t } = useTranslation();

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <div className="relative text-text-primary overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full -mr-20 -mt-20 opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 blur-[100px] rounded-full -ml-20 -mb-20 opacity-30" />

      <div className="relative p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0 mx-auto md:mx-0">
            {user.profile?.profileImageUrl ? (
              <img
                src={user.profile.profileImageUrl}
                alt={user.profile.fullName}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover ring-4 ring-zinc-800 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-800/50 flex items-center justify-center rounded-2xl ring-4 ring-zinc-800/50 shadow-xl">
                <UserIcon className="w-16 h-16 text-text-secondary" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-zinc-900 rounded-lg p-1.5 ring-2 ring-zinc-800 shadow-md">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 w-full text-center md:text-left space-y-6">
            <div>
              <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4 mb-3">
                <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">
                  {user.profile?.fullName ||
                    user.profile?.username ||
                    t("common.unknown")}
                </h1>
                <span className="px-4 py-1.5 rounded-full bg-zinc-800/80 text-text-secondary font-bold border border-zinc-700 text-sm uppercase tracking-wide shadow-sm backdrop-blur-md">
                  {formatRole(user.role || "User")}
                </span>
              </div>

              <p className="text-xl text-primary-400 font-medium tracking-wide">
                @{user.profile?.username}
              </p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                {user.profile?.gender && (
                  <span className="px-3 py-1 bg-zinc-800/50 text-text-secondary text-xs font-semibold uppercase tracking-wider rounded-lg border border-zinc-700/50">
                    {user.profile.gender}
                  </span>
                )}
                {user.profile?.age && (
                  <span className="px-3 py-1 bg-zinc-800/50 text-text-secondary text-xs font-semibold uppercase tracking-wider rounded-lg border border-zinc-700/50">
                    {user.profile.age} {t("common.years")}
                  </span>
                )}
                <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-xs font-semibold uppercase tracking-wider rounded-lg border border-primary-500/20">
                  ID: {user._id.slice(-6)}
                </span>
              </div>
            </div>

            {/* Contact Grid */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2 border-t border-zinc-800/50">
              {user.profile?.email && (
                <button
                  onClick={() =>
                    user.profile.email && openGmail(user.profile.email)
                  }
                  className="flex items-center gap-3 text-text-secondary hover:text-text-primary group transition-colors px-3 py-2 rounded-xl hover:bg-zinc-800/50 cursor-pointer text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 border border-zinc-700 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-text-secondary/70 group-hover:text-text-secondary">
                      {t("common.email", "Email")}
                    </span>
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {user.profile.email}
                    </span>
                  </div>
                </button>
              )}

              {user.profile?.phoneNumber && (
                <button
                  onClick={() =>
                    user.profile.phoneNumber &&
                    openWhatsApp(user.profile.phoneNumber)
                  }
                  className="flex items-center gap-3 text-text-secondary hover:text-text-primary group transition-colors px-3 py-2 rounded-xl hover:bg-zinc-800/50 cursor-pointer text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 border border-zinc-700 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-text-secondary/70 group-hover:text-text-secondary">
                      {t("common.phoneNumber", "Phone Number")}
                    </span>
                    <span className="text-sm font-medium">
                      {user.profile.phoneNumber}
                    </span>
                  </div>
                </button>
              )}

              <div className="flex items-center gap-3 text-text-secondary px-3 py-2 rounded-xl bg-zinc-800/20 border border-zinc-800/50 cursor-default">
                <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50 text-text-secondary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-text-secondary/70">
                    {t("common.joined", "Joined")}
                  </span>
                  <span className="text-sm font-medium">
                    {format(
                      new Date(user.createdAt || Date.now()),
                      "MMMM yyyy"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

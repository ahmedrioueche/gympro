import { Building2, Dumbbell, ShieldCheck, User, UserCog } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../../store/user";

export function UserRoleBadge() {
  const { user, activeDashboard } = useUserStore();
  const { t } = useTranslation();

  if (!user) return null;

  // Configuration for different roles/dashboards
  const roleConfig: Record<
    string,
    { label: string; icon: any; colorClass: string; iconClass: string }
  > = {
    admin: {
      label: t("roles.admin", "System Admin"),
      icon: ShieldCheck,
      colorClass:
        "from-indigo-500/30 via-purple-500/20 to-violet-500/30 border-indigo-500/40 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]",
      iconClass: "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40",
    },
    app_editor: {
      label: t("roles.app_editor", "App Editor"),
      icon: UserCog,
      colorClass:
        "from-emerald-500/30 via-teal-500/20 to-cyan-500/30 border-emerald-500/40 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]",
      iconClass: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40",
    },
    manager: {
      label:
        user.role === "owner"
          ? t("roles.owner", "Gym Owner")
          : t("roles.manager", "Gym Manager"),
      icon: Building2,
      colorClass:
        "from-amber-500/30 via-orange-500/20 to-yellow-500/30 border-amber-500/40 shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]",
      iconClass: "bg-amber-500 text-white shadow-lg shadow-amber-500/40",
    },
    coach: {
      label: t("roles.coach", "Fitness Coach"),
      icon: Dumbbell,
      colorClass:
        "from-blue-500/30 via-sky-500/20 to-cyan-500/30 border-blue-500/40 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]",
      iconClass: "bg-blue-500 text-white shadow-lg shadow-blue-500/40",
    },
    member: {
      label: t("roles.member", "Gym Member"),
      icon: User,
      colorClass:
        "from-rose-500/30 via-pink-500/20 to-fuchsia-500/30 border-rose-500/40 shadow-[0_0_20px_-5px_rgba(244,63,94,0.4)]",
      iconClass: "bg-rose-500 text-white shadow-lg shadow-rose-500/40",
    },
  };

  // Determine which config to use
  // Admin and Editor are global roles that override the dashboard context in the badge
  const isSpecialRole = user.role === "admin" || user.role === "app_editor";
  const baseKey = user.role === "owner" ? "manager" : user.role;
  const currentKey = isSpecialRole
    ? (user.role as string)
    : activeDashboard || baseKey;
  const config = roleConfig[currentKey] || roleConfig.member;

  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 w-fit
        backdrop-blur-md bg-white/10
        bg-gradient-to-br ${config.colorClass}
        hover:scale-[1.02] active:scale-[0.98]
        cursor-default select-none
      `}
    >
      <div
        className={`p-1.5 rounded-lg transition-transform duration-300 group-hover:rotate-12 ${config.iconClass}`}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-text-primary font-bold uppercase tracking-widest opacity-60">
          {t("common.currentRole", "Current Role")}
        </span>
        <span className="text-sm font-black text-text-primary tracking-tight">
          {config.label}
        </span>
      </div>
    </div>
  );
}

import { ShieldCheck, UserCog } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../../../store/user";

export function UserRoleBadge() {
  const { user } = useUserStore();
  const { t } = useTranslation();

  if (!user) return null;

  const isEditor = user.role === "app_editor";
  const label = isEditor ? "App Editor" : "System Admin";
  const Icon = isEditor ? UserCog : ShieldCheck;

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300
        ${
          isEditor
            ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/30"
            : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 hover:border-indigo-500/30"
        }
      `}
    >
      <div
        className={`
          p-2 rounded-lg 
          ${
            isEditor
              ? "bg-emerald-500/20 text-emerald-500"
              : "bg-indigo-500/20 text-indigo-500"
          }
        `}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">
          {t("common.currentRole", "Current Role")}
        </span>
        <span className="text-sm font-semibold text-text-primary">{label}</span>
      </div>
    </div>
  );
}

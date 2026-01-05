import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../../constants/navigation";

interface MembersEmptyStateProps {
  type?: "no-members" | "no-results";
}

export function MembersEmptyState({
  type = "no-members",
}: MembersEmptyStateProps) {
  const { t } = useTranslation();

  const isNoMembers = type === "no-members";
  const emoji = isNoMembers ? "👥" : "🔍";
  const titleKey = isNoMembers
    ? "members.empty.title"
    : "members.search.noResults.title";
  const descriptionKey = isNoMembers
    ? "members.empty.description"
    : "members.search.noResults.description";

  return (
    <div className="bg-surface border border-border rounded-2xl p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <span className="text-5xl">{emoji}</span>
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          {t(titleKey)}
        </h3>
        <p className="text-text-secondary mb-6">{t(descriptionKey)}</p>
        {isNoMembers ? (
          <Link
            to={APP_PAGES.gym.manager.createMember.link}
            className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-[42px] text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus />
            {t("members.empty.action")}
          </Link>
        ) : (
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
          >
            <span>🔄</span>
            {t("members.search.noResults.action", "Try Again")}
          </button>
        )}
      </div>
    </div>
  );
}

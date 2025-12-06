import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";

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
            to={APP_PAGES.gym.createMember.link}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
          >
            <span>➕</span>
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

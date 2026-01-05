import { useTranslation } from "react-i18next";

interface MembersStatsProps {
  total: number;
  active: number;
  expired: number;
  thisMonth: number;
}

export function MembersStats({
  total,
  active,
  expired,
  thisMonth,
}: MembersStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-3 md:p-4">
        <p className="text-xl md:text-2xl font-bold text-primary">{total}</p>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          {t("members.stats.total")}
        </p>
      </div>
      <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-3 md:p-4">
        <p className="text-xl md:text-2xl font-bold text-success">{active}</p>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          {t("members.stats.active")}
        </p>
      </div>
      <div className="bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl p-3 md:p-4">
        <p className="text-xl md:text-2xl font-bold text-warning">{expired}</p>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          {t("members.stats.expired")}
        </p>
      </div>
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-3 md:p-4">
        <p className="text-xl md:text-2xl font-bold text-accent">{thisMonth}</p>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          {t("members.stats.thisMonth")}
        </p>
      </div>
    </div>
  );
}

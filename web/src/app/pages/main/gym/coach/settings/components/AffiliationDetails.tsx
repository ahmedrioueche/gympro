import type { GymCoachAffiliation } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Building2, Calendar, CheckCircle, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AffiliationDetailsProps {
  affiliation: GymCoachAffiliation;
}

export function AffiliationDetails({ affiliation }: AffiliationDetailsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-primary" />
        {t("coach.settings.gym.generalInfo", "Affiliation Details")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">
            {t("common.status")}
          </label>
          <div className="flex items-center gap-2 text-success font-medium">
            <CheckCircle className="w-4 h-4" />
            <span className="capitalize">{affiliation.status}</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {t("common.joinedAt")}
            </span>
          </label>
          <p className="text-text-primary font-medium">
            {format(new Date(affiliation.startDate), "MMMM dd, yyyy")}
          </p>
        </div>

        {affiliation.commissionRate !== undefined && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary">
              <span className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                {t("coach.settings.gym.commission", "Commission Rate")}
              </span>
            </label>
            <p className="text-text-primary font-medium">
              {affiliation.commissionRate}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

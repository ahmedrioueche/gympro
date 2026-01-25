import type { GymCoachAffiliation } from "@ahmedrioueche/gympro-client";
import { CheckCircle, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ActivePermissionsProps {
  affiliation: GymCoachAffiliation;
}

export function ActivePermissions({ affiliation }: ActivePermissionsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        {t("coach.settings.gym.permissions", "Active Permissions")}
      </h3>

      <p className="text-sm text-text-secondary mb-4">
        {t(
          "coach.settings.gym.permissionsDesc",
          "These permissions are granted by the gym manager.",
        )}
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-surface-hover rounded-lg border border-border">
          <span className="text-text-primary text-sm font-medium">
            {t("coach.permissions.canScheduleSessions", "Schedule Sessions")}
          </span>
          {affiliation.permissions.canScheduleSessions ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-text-secondary/30" />
          )}
        </div>

        <div className="flex items-center justify-between p-3 bg-surface-hover rounded-lg border border-border">
          <span className="text-text-primary text-sm font-medium">
            {t("coach.permissions.canAccessFacilities", "Access Facilities")}
          </span>
          {affiliation.permissions.canAccessFacilities ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-text-secondary/30" />
          )}
        </div>
      </div>
    </div>
  );
}

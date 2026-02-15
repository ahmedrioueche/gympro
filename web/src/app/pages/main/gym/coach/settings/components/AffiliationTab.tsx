import type { GymCoachAffiliation } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle,
  CreditCard,
  LogOut,
  Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";
import SettingsTab from "../../../../../../components/settings/SettingsTab";

interface AffiliationTabProps {
  affiliation: GymCoachAffiliation;
  onLeave: () => void;
  isLeaving: boolean;
}

export default function AffiliationTab({
  affiliation,
  onLeave,
  isLeaving,
}: AffiliationTabProps) {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={t("coach.settings.tabs.affiliation", "Gym Affiliation")}
      description={t(
        "coach.settings.gym.subtitle",
        "Manage your gym affiliation and permissions",
      )}
      icon={Building2}
    >
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("coach.settings.gym.generalInfo", "Affiliation Details")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "coach.settings.gym.generalInfoDesc",
            "General information about your current gym affiliation",
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-surface-hover/50 rounded-2xl border border-border/50">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3" />
              {t("common.status")}
            </p>
            <div className="flex items-center gap-2 text-success font-semibold mt-0.5">
              <span className="capitalize">{affiliation.status}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {t("common.joinedAt")}
            </p>
            <p className="text-text-primary font-semibold mt-0.5">
              {format(new Date(affiliation.startDate), "MMMM dd, yyyy")}
            </p>
          </div>

          {affiliation.commissionRate !== undefined && (
            <div className="col-span-full space-y-1 pt-3 border-t border-border/50">
              <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                <CreditCard className="w-3 h-3" />
                {t("coach.settings.gym.commission", "Commission Rate")}
              </p>
              <p className="text-xl font-bold text-primary mt-0.5">
                {affiliation.commissionRate}%
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-10 border-t border-border mt-10">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("coach.settings.gym.permissions", "Active Permissions")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "coach.settings.gym.permissionsDesc",
            "Permissions granted to you by the gym management",
          )}
        </p>

        <div className="space-y-3">
          {[
            {
              id: "canScheduleSessions",
              label: t(
                "coach.permissions.canScheduleSessions",
                "Schedule Sessions",
              ),
              checked: affiliation.permissions.canScheduleSessions,
            },
            {
              id: "canAccessFacilities",
              label: t(
                "coach.permissions.canAccessFacilities",
                "Access Facilities",
              ),
              checked: affiliation.permissions.canAccessFacilities,
            },
          ].map((perm) => (
            <div
              key={perm.id}
              className="flex items-center justify-between p-4 bg-surface-hover/50 rounded-2xl border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${perm.checked ? "bg-success/10 text-success" : "bg-surface text-text-secondary border border-border/50"}`}
                >
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-text-primary text-sm font-semibold">
                  {perm.label}
                </span>
              </div>
              {perm.checked ? (
                <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle className="w-3 h-3" />
                  {t("common.granted", "Granted")}
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-surface text-text-secondary/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-border/50">
                  {t("common.revoked", "Revoked")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 border-t border-border mt-10">
        <div className="bg-red-500/5 rounded-[2rem] p-6 border border-red-500/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-red-500/10 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h4 className="text-lg font-bold text-red-500">
              {t("settings.dangerZone")}
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 rounded-2xl border border-red-500/10 shadow-sm shadow-red-500/5">
            <div>
              <h5 className="font-bold text-text-primary">
                {t("coach.settings.gym.leaveGym")}
              </h5>
              <p className="text-sm text-text-secondary mt-1 max-w-sm">
                {t("coach.settings.gym.leaveGymDesc")}
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold px-8 shadow-lg shadow-red-500/10"
              onClick={onLeave}
              loading={isLeaving}
              icon={<LogOut className="w-4 h-4" />}
            >
              {t("common.leave", "Leave Gym")}
            </Button>
          </div>
        </div>
      </div>
    </SettingsTab>
  );
}

import { AlertTriangle, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";

interface DangerZoneProps {
  onLeave: () => void;
  isLeaving: boolean;
}

export function DangerZone({ onLeave, isLeaving }: DangerZoneProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-danger/20 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-danger mb-1 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        {t("settings.dangerZone", "Danger Zone")}
      </h3>
      <p className="text-sm text-text-secondary mb-4">
        {t(
          "coach.settings.gym.dangerZoneDesc",
          "Irreversible actions regarding your affiliation.",
        )}
      </p>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-text-primary">
            {t("coach.settings.gym.leaveGym", "Leave Gym")}
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            {t(
              "coach.settings.gym.leaveGymDesc",
              "Terminate your affiliation with this gym immediately.",
            )}
          </p>
        </div>
        <Button
          variant="outline"
          className="border-error text-error hover:bg-error hover:text-white"
          onClick={onLeave}
          loading={isLeaving}
          icon={<LogOut className="w-4 h-4" />}
        >
          {t("common.leave", "Leave")}
        </Button>
      </div>
    </div>
  );
}

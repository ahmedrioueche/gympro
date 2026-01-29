import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CoachProfileActionsProps {
  onClose: () => void;
  onRequestCoaching?: () => void;
  onInviteToGym?: () => void;
  isMemberDashboard: boolean;
  isManagerDashboard: boolean;
  isAlreadyCoached: boolean;
  isAlreadyAffiliated: boolean;
  hasCurrentGym: boolean;
}

export function CoachProfileActions({
  onClose,
  onRequestCoaching,
  onInviteToGym,
  isMemberDashboard,
  isManagerDashboard,
  isAlreadyCoached,
  isAlreadyAffiliated,
  hasCurrentGym,
}: CoachProfileActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end gap-3 w-full">
      <button
        className="px-4 py-2 rounded-xl border border-border bg-surface hover:bg-surface-hover text-text-secondary font-medium transition-colors"
        onClick={onClose}
      >
        {t("common.close")}
      </button>

      {/* Member: Request Coaching */}
      {isMemberDashboard && !isAlreadyCoached && onRequestCoaching && (
        <button
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          onClick={onRequestCoaching}
        >
          <UserPlus className="w-4 h-4" />
          {t("coaches.requestCoaching")}
        </button>
      )}

      {/* Manager: Invite to Gym */}
      {isManagerDashboard &&
        !isAlreadyAffiliated &&
        hasCurrentGym &&
        onInviteToGym && (
          <button
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            onClick={onInviteToGym}
          >
            <UserPlus className="w-4 h-4" />
            {t("coaching.inviteCoach")}
          </button>
        )}
    </div>
  );
}

import { useTranslation } from "react-i18next";
import UserAvatar from "../../../components/ui/UserAvatar";
import { useModalStore } from "../../../store/modal";
import { cn } from "../../../utils/helper";

interface MinimalCoachCardProps {
  coach: {
    _id: string;
    fullName: string;
    username: string;
    profileImageUrl?: string;
  };
  onClick?: () => void;
  className?: string;
}

export const MinimalCoachCard = ({
  coach,
  onClick,
  className,
}: MinimalCoachCardProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openModal("coach_profile", { coachId: coach._id });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md group hover:border-primary/30 transition-all cursor-pointer hover:bg-white/10",
        className,
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
        <UserAvatar
          avatar={coach.profileImageUrl}
          name={coach.fullName || coach.username}
          className="w-14 h-14 relative z-10 border-2 border-white/10 group-hover:border-primary/50 transition-colors"
        />
      </div>
      <div>
        <p className="font-bold text-white text-lg group-hover:text-primary transition-colors">
          {coach.fullName || coach.username}
        </p>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            {t("common.coach", "Your Coach")}
          </p>
        </div>
      </div>
    </div>
  );
};

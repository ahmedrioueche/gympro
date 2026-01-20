import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/Button";

export interface ProfileModalAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: "filled" | "outline" | "ghost";
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
  loading?: boolean;
  disabled?: boolean;
}

interface ProfileModalFooterProps {
  onClose: () => void;
  actions?: ProfileModalAction[];
  closeLabel?: string;
}

export function ProfileModalFooter({
  onClose,
  actions = [],
  closeLabel,
}: ProfileModalFooterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end gap-3 w-full">
      <Button variant="outline" color="secondary" onClick={onClose}>
        {closeLabel || t("common.close")}
      </Button>

      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={index}
            variant={action.variant || "filled"}
            color={action.color || "primary"}
            onClick={action.onClick}
            loading={action.loading}
            disabled={action.disabled}
            icon={Icon ? <Icon className="w-4 h-4" /> : undefined}
            className="group/btn relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-[42px] text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-purple-500/15 overflow-hidden"
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

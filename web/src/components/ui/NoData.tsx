import type { LucideIcon } from "lucide-react";
import { MessageCircle } from "lucide-react";
import React, { type ElementType } from "react";
import { useTranslation } from "react-i18next";

interface ActionButton {
  label: string;
  icon?: ElementType;
  onClick: () => void;
  className?: string;
}

interface NoDataProps {
  icon?: LucideIcon;
  emoji?: string;
  title?: string;
  description?: string;
  actionButton?: ActionButton;
}

const NoData: React.FC<NoDataProps> = ({
  icon: Icon,
  emoji,
  title,
  description,
  actionButton,
}) => {
  const { t } = useTranslation();

  const IconComponent = Icon || MessageCircle;
  const displayTitle = title || t("general.no_data");
  const displayDescription = description || t("general.no_data_desc");
  const ActionIcon = actionButton?.icon;

  return (
    <div className="bg-surface border border-border rounded-2xl p-12 text-center">
      {emoji ? (
        <div className="text-6xl mb-4">{emoji}</div>
      ) : (
        <div className="inline-flex p-4 rounded-full bg-background mb-4">
          <IconComponent className="w-12 h-12 text-text-secondary opacity-30" />
        </div>
      )}
      <h3 className="text-xl font-bold text-text-primary mb-2">
        {displayTitle}
      </h3>
      <p className="text-text-secondary max-w-sm mx-auto mb-6">
        {displayDescription}
      </p>
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className={
            actionButton.className ||
            "group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-[42px] text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
          }
        >
          {ActionIcon && <ActionIcon size={20} />}
          {actionButton.label}
        </button>
      )}
    </div>
  );
};

export default NoData;

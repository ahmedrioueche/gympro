import type { LucideIcon } from "lucide-react";
import { MessageCircle } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface NoDataProps {
  icon?: LucideIcon;
  emoji?: string;
  title?: string;
  description?: string;
}

const NoData: React.FC<NoDataProps> = ({
  icon: Icon,
  emoji,
  title,
  description,
}) => {
  const { t } = useTranslation();

  const IconComponent = Icon || MessageCircle;
  const displayTitle = title || t("general.no_data");
  const displayDescription = description || t("general.no_data_desc");

  return (
    <div className="bg-surface border border-border rounded-2xl p-12 text-center">
      {emoji ? (
        <div className="text-6xl mb-4">{emoji}</div>
      ) : (
        <IconComponent className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
      )}
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {displayTitle}
      </h3>
      <p className="text-text-secondary">{displayDescription}</p>
    </div>
  );
};

export default NoData;

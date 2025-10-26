import { MessageCircle } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const NoData: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 w-full h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-2xl shadow-lg px-8 py-10 min-w-[320px] max-w-full ">
        <MessageCircle className="w-14 h-14 mb-4 text-blue-500 dark:text-blue-400 drop-shadow" />
        <div className="text-xl font-bold text-blue-600 dark:text-blue-300 mb-1">
          {t("general.no_data")}
        </div>
        <div className="text-base mt-1 text-gray-500 dark:text-gray-300">
          {t("general.no_data_desc")}
        </div>
      </div>
    </div>
  );
};

export default NoData;

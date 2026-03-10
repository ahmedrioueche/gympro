import { MapPin } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface DummyPageWrapperProps {
  children: React.ReactNode;
  pageTitle: string;
  locationKey: string;
  hideHeader?: boolean;
}

export const DummyPageWrapper: React.FC<DummyPageWrapperProps> = ({
  children,
  pageTitle,
  locationKey,
  hideHeader = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
      {/* Page Header Mock */}
      {!hideHeader && (
        <div className="w-full max-w-4xl mb-2 md:mb-3 flex flex-col md:flex-row md:items-end justify-between gap-1 md:gap-2 border-b border-border/40 pb-2 flex-shrink-0">
          <div className="text-start w-full">
            <h3 className="text-lg md:text-xl font-black text-text-primary mb-0.5">
              {pageTitle}
            </h3>
            <div className="flex items-center gap-1.5 text-primary">
              <MapPin className="w-2.5 md:w-3 h-2.5 md:h-3" />
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-none">
                {t(`welcomeTour.dummies.locations.${locationKey}`)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-start md:justify-center min-h-0 pt-1">
        {children}
      </div>
    </div>
  );
};

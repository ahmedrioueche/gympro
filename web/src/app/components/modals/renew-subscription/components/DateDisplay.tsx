import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface DateDisplayProps {
  startDate: string;
  endDate: string;
  isExtending: boolean;
}

export function DateDisplay({
  startDate,
  endDate,
  isExtending,
}: DateDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4 bg-surface-hover rounded-xl border border-border">
      {isExtending && (
        <p className="text-xs text-success mb-2 font-medium">
          ✓{" "}
          {t(
            "renewSubscription.extendingFrom",
            "Extending from current end date"
          )}
        </p>
      )}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">
            {t("renewSubscription.startsOn", "Starts On")}
          </p>
          <p className="text-sm font-medium text-text-primary">
            {format(new Date(startDate), "PPP")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">
            {t("renewSubscription.calculatedEndDate")}
          </p>
          <p className="text-lg font-bold text-primary">
            {format(new Date(endDate), "PPP")}
          </p>
        </div>
      </div>
    </div>
  );
}

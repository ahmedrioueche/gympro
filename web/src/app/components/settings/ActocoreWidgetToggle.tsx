import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ActocoreWidgetToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function ActocoreWidgetToggle({
  enabled,
  onChange,
}: ActocoreWidgetToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="pt-8 border-t border-border">
      <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
        {t("extra.settings.actocore.title", "AI Assistant")}
      </h4>
      <p className="text-sm text-text-secondary mb-4">
        {t(
          "extra.settings.actocore.desc",
          "Control visibility of the ActoCore chat assistant",
        )}
      </p>

      <div className="flex items-center gap-3 p-4 bg-surface-hover/50 rounded-2xl border border-border/50">
        <input
          type="checkbox"
          id="showActocoreWidget"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
        />
        <div className="flex-1">
          <label
            htmlFor="showActocoreWidget"
            className="text-sm font-semibold text-text-primary cursor-pointer"
          >
            {t("extra.settings.actocore.showWidget", "Show ActoCore widget")}
          </label>
          <p className="text-xs text-text-secondary mt-0.5">
            {t(
              "extra.settings.actocore.showWidgetDesc",
              "Display the floating chat assistant while using the app",
            )}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-white shadow-sm border border-border/50 text-primary">
          <Bot className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

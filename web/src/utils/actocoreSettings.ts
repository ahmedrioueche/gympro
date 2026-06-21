import type { AppSettings } from "@ahmedrioueche/gympro-client";

export type AppSettingsWithActocore = AppSettings & {
  showActocoreWidget?: boolean;
};

export const getShowActocoreWidget = (
  appSettings?: AppSettings | null,
): boolean =>
  (appSettings as AppSettingsWithActocore | undefined)?.showActocoreWidget ??
  true;

export const withActocoreWidgetSetting = (
  appSettings: AppSettings | undefined,
  showActocoreWidget: boolean,
): AppSettingsWithActocore => ({
  ...(appSettings ?? ({} as AppSettings)),
  showActocoreWidget,
});

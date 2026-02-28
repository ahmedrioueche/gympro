import { LanguageMap } from "./common";

export type TopBannerVariant = "info" | "success" | "warning" | "error";

export type TopBannerActionType = "none" | "link" | "modal";

export interface TopBannerAction {
  type: TopBannerActionType;
  payload?: string; // e.g. URL or Modal ID
}

export interface AppBanner {
  _id: string;
  translations: LanguageMap;
  variant: TopBannerVariant;
  color?: string; // Optional tailwind class or hex code
  action: TopBannerAction;
  isRemovable: boolean;
  frequencyHours: number; // 0 = dismissed forever
  isActive: boolean;
  templateKey?: string; // Key for system-triggered banners
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppBannerDto {
  translations: LanguageMap;
  variant: TopBannerVariant;
  color?: string;
  action: TopBannerAction;
  isRemovable: boolean;
  frequencyHours: number;
  isActive: boolean;
  templateKey?: string;
}

export interface UpdateAppBannerDto extends Partial<CreateAppBannerDto> {}

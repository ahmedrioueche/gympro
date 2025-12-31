import { GymSettings } from "../types/gym";

export type CreateGymDto = {
  name: string;
  owner: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone?: string;
  logoUrl?: string;
  slogan?: string;
  defaultCurrency?: string;
  settings?: GymSettings;
  latitude?: number;
  longitude?: number;
};

export type UpdateGymSettingsDto = Partial<GymSettings>;

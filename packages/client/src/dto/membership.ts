import { MembershipSettings } from "../types/membership";

export interface UpdateMembershipSettingsDto {
  settings: Partial<MembershipSettings>;
}

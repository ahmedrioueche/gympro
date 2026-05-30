import {
  ENABLE_GENERAL_SMS,
  ENABLE_PHONE_FEATURES,
} from "@ahmedrioueche/gympro-client";

export function usePhoneFeatures() {
  return {
    isPhoneEnabled: ENABLE_PHONE_FEATURES,
    isGeneralSmsEnabled: ENABLE_GENERAL_SMS,
  };
}

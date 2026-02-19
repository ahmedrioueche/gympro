export enum GymManagerFeature {
  MEMBERS = "MEMBERS",
  SERVICES_PRICING = "SERVICES_PRICING",
  SUBSCRIPTIONS = "SUBSCRIPTIONS",
  ACCESS_CONTROL_QR = "ACCESS_CONTROL_QR",
  ATTENDANCE = "ATTENDANCE",
  COACHING = "COACHING",
  CLASSES = "CLASSES",
  STAFF = "STAFF",
  MARKETING = "MARKETING",
  INVENTORY = "INVENTORY",
  STORE = "STORE",
  COMPETITIONS = "COMPETITIONS",
  ANNOUNCEMENTS = "ANNOUNCEMENTS",
  ANALYTICS = "ANALYTICS",
  EMAIL_NOTIFICATIONS = "EMAIL_NOTIFICATIONS",
  SMS_NOTIFICATIONS = "SMS_NOTIFICATIONS",
}

export type AppFeature = GymManagerFeature;

export const GYM_MANAGER_FEATURES = Object.values(GymManagerFeature);

export interface AppFeatureMetadata {
  key: GymManagerFeature;
  labelKey: string;
  isPublic: boolean;
}

export const GYM_MANAGER_FEATURE_METADATA: Record<
  GymManagerFeature,
  AppFeatureMetadata
> = {
  [GymManagerFeature.EMAIL_NOTIFICATIONS]: {
    key: GymManagerFeature.EMAIL_NOTIFICATIONS,
    labelKey: "features.email_notifications",
    isPublic: true,
  },
  [GymManagerFeature.SMS_NOTIFICATIONS]: {
    key: GymManagerFeature.SMS_NOTIFICATIONS,
    labelKey: "features.sms_notifications",
    isPublic: true,
  },
  [GymManagerFeature.MEMBERS]: {
    key: GymManagerFeature.MEMBERS,
    labelKey: "features.members",
    isPublic: true,
  },
  [GymManagerFeature.SERVICES_PRICING]: {
    key: GymManagerFeature.SERVICES_PRICING,
    labelKey: "features.services_pricing",
    isPublic: true,
  },
  [GymManagerFeature.SUBSCRIPTIONS]: {
    key: GymManagerFeature.SUBSCRIPTIONS,
    labelKey: "features.subscriptions",
    isPublic: true,
  },
  [GymManagerFeature.ACCESS_CONTROL_QR]: {
    key: GymManagerFeature.ACCESS_CONTROL_QR,
    labelKey: "features.access_control_qr",
    isPublic: true,
  },
  [GymManagerFeature.ATTENDANCE]: {
    key: GymManagerFeature.ATTENDANCE,
    labelKey: "features.attendance",
    isPublic: true,
  },
  [GymManagerFeature.COACHING]: {
    key: GymManagerFeature.COACHING,
    labelKey: "features.coaching",
    isPublic: true,
  },
  [GymManagerFeature.CLASSES]: {
    key: GymManagerFeature.CLASSES,
    labelKey: "features.classes",
    isPublic: true,
  },
  [GymManagerFeature.STAFF]: {
    key: GymManagerFeature.STAFF,
    labelKey: "features.staff",
    isPublic: true,
  },
  [GymManagerFeature.MARKETING]: {
    key: GymManagerFeature.MARKETING,
    labelKey: "features.marketing",
    isPublic: true,
  },
  [GymManagerFeature.INVENTORY]: {
    key: GymManagerFeature.INVENTORY,
    labelKey: "features.inventory",
    isPublic: true,
  },
  [GymManagerFeature.STORE]: {
    key: GymManagerFeature.STORE,
    labelKey: "features.store",
    isPublic: true,
  },
  [GymManagerFeature.COMPETITIONS]: {
    key: GymManagerFeature.COMPETITIONS,
    labelKey: "features.competitions",
    isPublic: true,
  },
  [GymManagerFeature.ANNOUNCEMENTS]: {
    key: GymManagerFeature.ANNOUNCEMENTS,
    labelKey: "features.announcements",
    isPublic: true,
  },
  [GymManagerFeature.ANALYTICS]: {
    key: GymManagerFeature.ANALYTICS,
    labelKey: "features.analytics",
    isPublic: false,
  },
};

// Dynamic Feature Packages
export type {
  AppFeaturePackage,
  CreateAppFeaturePackageDto,
  UpdateAppFeaturePackageDto,
} from "../dto/appSubscription";

export function getFeatureLabelKey(feature: GymManagerFeature): string {
  return (
    GYM_MANAGER_FEATURE_METADATA[feature]?.labelKey ||
    `features.${feature.toLowerCase()}`
  );
}

export function getPublicFeatures(
  features: GymManagerFeature[],
): GymManagerFeature[] {
  return features.filter(
    (f) => GYM_MANAGER_FEATURE_METADATA[f]?.isPublic !== false,
  );
}

import type { BlockerModalConfig } from "@ahmedrioueche/gympro-client";
import type {
  AccessManagementModalProps,
  AdminCreateEditorModalProps,
  AdminManagePermissionsModalProps,
  AlertDetailsModalProps,
  AssignProgramModalProps,
  BannerFormModalProps,
  CancelSubscriptionModalProps,
  ClassDetailsModalProps,
  ClientProfileModalProps,
  CoachingOfferModalProps,
  CoachPricingModalProps,
  CoachProfileModalProps,
  CompetitionDetailsModalProps,
  CompetitionModalProps,
  CompetitionParticipantsModalProps,
  ConfirmModalProps,
  CreateAnnouncementModalProps,
  CreateExerciseModalProps,
  CreateMemberModalProps,
  CreateSessionModalProps,
  DeleteAccountModalProps,
  EditAppPlanModalProps,
  EditManagerModalProps,
  ExerciseDetailModalProps,
  FeaturePackageModalProps,
  GymClassModalProps,
  GymDetailsModalProps,
  GymInvitationModalProps,
  GymMediaModalProps,
  InventoryItemModalProps,
  InviteCoachModalProps,
  LogSessionModalProps,
  MemberProfileModalProps,
  PricingModalProps,
  ProductDetailsModalProps,
  ProductModalProps,
  ProgramDetailsModalProps,
  RenewSubscriptionModalProps,
  ReportDetailsModalProps,
  RequestCoachModalProps,
  RequestGymModalProps,
  ReviewCoachRequestModalProps,
  ScanResultModalProps,
  ServiceModalProps,
  SessionDetailsModalProps,
  SetWinnersModalProps,
  StaffModalProps,
  UpgradePreviewModalProps,
  UserProfileModalProps,
  WelcomeTourModalProps,
} from "../types/modals";

export type ModalType =
  | "confirm"
  | "upgrade_preview"
  | "edit_user_profile"
  | "exercise_detail"
  | "scan_result"
  | "renew_subscription"
  | "cancel_subscription"
  | "staff_modal"
  | "request_coach"
  | "request_coach_access"
  | "create_program"
  | "program_details"
  | "create_exercise"
  | "create_session"
  | "session_details"
  | "invite_coach"
  | "request_gym_affiliation"
  | "assign_program"
  | "member_profile"
  | "client_profile"
  | "coach_profile"
  | "coach_pricing"
  | "gym_invitation"
  | "create_announcement"
  | "admin_review_coach_request"
  | "edit_app_plan"
  | "log_session"
  | "admin_manage_permissions"
  | "admin_create_editor"
  | "report_details"
  | "alert_details"
  | "inventory_item"
  | "competition"
  | "create-product"
  | "edit-product"
  | "add-gym-media"
  | "create-report"
  | "user_profile"
  | "product-details"
  | "competition-details"
  | "set-winners"
  | "competition-participants"
  | "gym_class"
  | "service"
  | "pricing"
  | "create_member"
  | "class_details"
  | "coaching_offer"
  | "create_gym"
  | "feature_package"
  | "banner_form"
  | "subscription_warning"
  | "welcome_tour"
  | "access_management"
  | "gym_details"
  | "delete_account";

export type ActiveModalType = ModalType | null;

export interface ModalStackEntry {
  id: string;
  type: ModalType;
  props?: unknown;
}

export interface ModalLegacyProps {
  confirmModalProps?: ConfirmModalProps;
  upgradePreviewProps?: UpgradePreviewModalProps;
  editManagerProps?: EditManagerModalProps;
  exerciseModalProps?: ExerciseDetailModalProps;
  scanResultProps?: ScanResultModalProps;
  renewSubscriptionProps?: RenewSubscriptionModalProps;
  cancelSubscriptionProps?: CancelSubscriptionModalProps;
  staffModalProps?: StaffModalProps;
  requestCoachProps?: RequestCoachModalProps;
  programDetailsProps?: ProgramDetailsModalProps;
  createExerciseProps?: CreateExerciseModalProps;
  createSessionProps?: CreateSessionModalProps;
  sessionDetailsProps?: SessionDetailsModalProps;
  inviteCoachProps?: InviteCoachModalProps;
  requestGymProps?: RequestGymModalProps;
  assignProgramProps?: AssignProgramModalProps;
  memberProfileProps?: MemberProfileModalProps;
  clientProfileProps?: ClientProfileModalProps;
  coachProfileProps?: CoachProfileModalProps;
  coachPricingProps?: CoachPricingModalProps;
  gymInvitationProps?: GymInvitationModalProps;
  createAnnouncementProps?: CreateAnnouncementModalProps;
  logSessionProps?: LogSessionModalProps;
  reviewCoachRequestProps?: ReviewCoachRequestModalProps;
  editAppPlanProps?: EditAppPlanModalProps;
  adminManagePermissionsProps?: AdminManagePermissionsModalProps;
  adminCreateEditorProps?: AdminCreateEditorModalProps;
  reportDetailsProps?: ReportDetailsModalProps;
  alertProps?: AlertDetailsModalProps;
  inventoryItemProps?: InventoryItemModalProps;
  competitionProps?: CompetitionModalProps;
  productProps?: ProductModalProps;
  gymMediaProps?: GymMediaModalProps;
  userProfileProps?: UserProfileModalProps;
  productDetailsProps?: ProductDetailsModalProps;
  competitionDetailsProps?: CompetitionDetailsModalProps;
  competitionParticipantsProps?: CompetitionParticipantsModalProps;
  setWinnersProps?: SetWinnersModalProps;
  gymClassProps?: GymClassModalProps;
  serviceProps?: ServiceModalProps;
  pricingProps?: PricingModalProps;
  createMemberProps?: CreateMemberModalProps;
  classDetailsProps?: ClassDetailsModalProps;
  coachingOfferProps?: CoachingOfferModalProps;
  featurePackageProps?: FeaturePackageModalProps;
  bannerFormProps?: BannerFormModalProps;
  welcomeTourProps?: WelcomeTourModalProps;
  subscriptionWarningProps?: { config?: BlockerModalConfig };
  accessManagementProps?: AccessManagementModalProps;
  gymDetailsProps?: GymDetailsModalProps;
  deleteAccountProps?: DeleteAccountModalProps;
}

const propsForType = (
  stack: ModalStackEntry[],
  type: ModalType,
): unknown | undefined => {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].type === type) return stack[i].props;
  }
  return undefined;
};

export const buildLegacyModalState = (
  stack: ModalStackEntry[],
): ModalLegacyProps & { currentModal: ActiveModalType } => ({
  currentModal: stack.at(-1)?.type ?? null,
  confirmModalProps: propsForType(stack, "confirm") as ConfirmModalProps,
  upgradePreviewProps: propsForType(
    stack,
    "upgrade_preview",
  ) as UpgradePreviewModalProps,
  editManagerProps: propsForType(
    stack,
    "edit_user_profile",
  ) as EditManagerModalProps,
  exerciseModalProps: propsForType(
    stack,
    "exercise_detail",
  ) as ExerciseDetailModalProps,
  scanResultProps: propsForType(stack, "scan_result") as ScanResultModalProps,
  renewSubscriptionProps: propsForType(
    stack,
    "renew_subscription",
  ) as RenewSubscriptionModalProps,
  cancelSubscriptionProps: propsForType(
    stack,
    "cancel_subscription",
  ) as CancelSubscriptionModalProps,
  staffModalProps: propsForType(stack, "staff_modal") as StaffModalProps,
  requestCoachProps: propsForType(
    stack,
    "request_coach",
  ) as RequestCoachModalProps,
  programDetailsProps: propsForType(
    stack,
    "program_details",
  ) as ProgramDetailsModalProps,
  createExerciseProps: propsForType(
    stack,
    "create_exercise",
  ) as CreateExerciseModalProps,
  createSessionProps: propsForType(
    stack,
    "create_session",
  ) as CreateSessionModalProps,
  sessionDetailsProps: propsForType(
    stack,
    "session_details",
  ) as SessionDetailsModalProps,
  inviteCoachProps: propsForType(
    stack,
    "invite_coach",
  ) as InviteCoachModalProps,
  requestGymProps: propsForType(
    stack,
    "request_gym_affiliation",
  ) as RequestGymModalProps,
  assignProgramProps: propsForType(
    stack,
    "assign_program",
  ) as AssignProgramModalProps,
  memberProfileProps: propsForType(
    stack,
    "member_profile",
  ) as MemberProfileModalProps,
  clientProfileProps: propsForType(
    stack,
    "client_profile",
  ) as ClientProfileModalProps,
  coachProfileProps: propsForType(
    stack,
    "coach_profile",
  ) as CoachProfileModalProps,
  coachPricingProps: propsForType(
    stack,
    "coach_pricing",
  ) as CoachPricingModalProps,
  gymInvitationProps: propsForType(
    stack,
    "gym_invitation",
  ) as GymInvitationModalProps,
  createAnnouncementProps: propsForType(
    stack,
    "create_announcement",
  ) as CreateAnnouncementModalProps,
  logSessionProps: propsForType(stack, "log_session") as LogSessionModalProps,
  reviewCoachRequestProps: propsForType(
    stack,
    "admin_review_coach_request",
  ) as ReviewCoachRequestModalProps,
  editAppPlanProps: propsForType(stack, "edit_app_plan") as EditAppPlanModalProps,
  adminManagePermissionsProps: propsForType(
    stack,
    "admin_manage_permissions",
  ) as AdminManagePermissionsModalProps,
  adminCreateEditorProps: propsForType(
    stack,
    "admin_create_editor",
  ) as AdminCreateEditorModalProps,
  reportDetailsProps: propsForType(
    stack,
    "report_details",
  ) as ReportDetailsModalProps,
  alertProps: propsForType(stack, "alert_details") as AlertDetailsModalProps,
  inventoryItemProps: propsForType(
    stack,
    "inventory_item",
  ) as InventoryItemModalProps,
  competitionProps: propsForType(stack, "competition") as CompetitionModalProps,
  productProps:
    (propsForType(stack, "create-product") as ProductModalProps) ??
    (propsForType(stack, "edit-product") as ProductModalProps),
  gymMediaProps:
    (propsForType(stack, "add-gym-media") as GymMediaModalProps) ??
    (propsForType(stack, "create-report") as GymMediaModalProps),
  userProfileProps: propsForType(stack, "user_profile") as UserProfileModalProps,
  productDetailsProps: propsForType(
    stack,
    "product-details",
  ) as ProductDetailsModalProps,
  competitionDetailsProps: propsForType(
    stack,
    "competition-details",
  ) as CompetitionDetailsModalProps,
  competitionParticipantsProps: propsForType(
    stack,
    "competition-participants",
  ) as CompetitionParticipantsModalProps,
  setWinnersProps: propsForType(stack, "set-winners") as SetWinnersModalProps,
  gymClassProps: propsForType(stack, "gym_class") as GymClassModalProps,
  serviceProps: propsForType(stack, "service") as ServiceModalProps,
  pricingProps: propsForType(stack, "pricing") as PricingModalProps,
  createMemberProps: propsForType(
    stack,
    "create_member",
  ) as CreateMemberModalProps,
  classDetailsProps: propsForType(
    stack,
    "class_details",
  ) as ClassDetailsModalProps,
  coachingOfferProps: propsForType(
    stack,
    "coaching_offer",
  ) as CoachingOfferModalProps,
  featurePackageProps: propsForType(
    stack,
    "feature_package",
  ) as FeaturePackageModalProps,
  bannerFormProps: propsForType(stack, "banner_form") as BannerFormModalProps,
  welcomeTourProps: propsForType(stack, "welcome_tour") as WelcomeTourModalProps,
  subscriptionWarningProps: propsForType(stack, "subscription_warning") as {
    config?: BlockerModalConfig;
  },
  accessManagementProps: propsForType(
    stack,
    "access_management",
  ) as AccessManagementModalProps,
  gymDetailsProps: propsForType(stack, "gym_details") as GymDetailsModalProps,
  deleteAccountProps: propsForType(
    stack,
    "delete_account",
  ) as DeleteAccountModalProps,
});

export const getModalStackIndex = (
  stack: ModalStackEntry[],
  type: ModalType,
): number => {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].type === type) return i;
  }
  return -1;
};

export const isModalTypeOpen = (
  stack: ModalStackEntry[],
  type: ModalType,
): boolean => getModalStackIndex(stack, type) >= 0;

export const createModalId = (): string =>
  globalThis.crypto?.randomUUID?.() ??
  `modal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

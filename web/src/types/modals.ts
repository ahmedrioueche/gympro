import type {
  Alert,
  AppEditorUser,
  AppFeaturePackage,
  AppPlan,
  CoachProfile,
  Competition,
  EditUserDto,
  EquipmentItem,
  Exercise,
  GymClass,
  GymService,
  ProgramDayProgress,
  ProgramHistory,
  Report,
  Session,
  SubscriptionType,
  TrainingProgram,
  User,
} from "@ahmedrioueche/gympro-client";
import type { Product } from "@ahmedrioueche/gympro-client/dist/types/product";

export interface FeaturePackageModalProps {
  pkg?: AppFeaturePackage | null;
}

export interface GymClassModalProps {
  gymId: string;
  gymClass?: GymClass;
  onSuccess?: () => void;
}

export interface InventoryItemModalProps {
  gymId: string;
  item?: EquipmentItem;
  onSuccess?: () => void;
}

export interface ConfirmModalProps {
  text?: string;
  title?: string;
  confirmText?: string;
  confirmVariant?: "danger" | "success" | "primary";
  onConfirm?: () => void;
  onCancel?: () => void;
  verificationText?: string;
  secondaryAction?: {
    label: string;
    onClick: () => void | Promise<void>;
    variant?: "danger" | "success" | "primary" | "default";
  };
}

export interface UpgradePreviewModalProps {
  onConfirm: () => void;
  currentPlan: AppPlan;
  targetPlan: AppPlan;
  previewData: {
    immediate_transaction?: {
      details: {
        totals: {
          total: string;
          subtotal: string;
          credit: string;
          balance: string;
        };
        line_items: Array<{
          totals: {
            total: string;
            subtotal: string;
          };
          proration?: {
            rate: string;
          };
        }>;
      };
    };
    credit?: string;
    update_summary?: {
      credit: {
        used: string;
      };
      charge: {
        total: string;
      };
    };
  };
  isLoading?: boolean;
}

export interface EditManagerModalProps {
  onConfirm: (data: EditUserDto) => void;
}

export interface ExerciseDetailModalProps {
  exercise: Exercise;
  currentUserId: string;
}

export interface ScanResultModalProps {
  result: {
    status: "granted" | "denied" | "verifying";
    name?: string;
    photo?: string;
    reason?: string;
    expiry?: string | Date;
    timestamp: Date;
  } | null;
}

export interface RenewSubscriptionModalProps {
  memberId: string;
  membershipId: string;
  memberName: string;
  currentSubscription?: {
    typeId: string;
    endDate: string;
  };
}

export interface CancelSubscriptionModalProps {
  subscriptionEndDate?: string | Date;
}

export interface StaffModalProps {
  gymId: string;
  mode: "add" | "edit";
  staff?: {
    membershipId: string;
    fullName: string;
    email?: string;
    phoneNumber?: string;
    role: string;
  };
  onSuccess?: () => void;
}

export interface RequestCoachModalProps {
  coach: CoachProfile;
}

export interface ProgramDetailsModalProps {
  program: TrainingProgram | null;
  isActive?: boolean;
  onUse: (programId: string) => void;
  onProgramUpdated?: (program: TrainingProgram) => void;
}

export interface CreateExerciseModalProps {
  exerciseToEdit?: Exercise;
}

export interface CreateSessionModalProps {
  onSuccess?: () => void;
  gymId?: string;
}

export interface SessionDetailsModalProps {
  session: Session;
}

export interface InviteCoachModalProps {
  gymId: string;
  onSuccess?: () => void;
}

export interface RequestGymModalProps {
  gym: {
    _id: string;
    name: string;
  };
  onSuccess?: () => void;
}

export interface AssignProgramModalProps {
  clientId: string;
  currentProgramId?: string;
  onSuccess?: () => void;
}

export interface MemberProfileModalProps {
  memberId: string;
  membershipId?: string;
}

export interface ClientProfileModalProps {
  clientId: string;
}

export interface CoachProfileModalProps {
  coachId?: string;
  coach?: CoachProfile;
  onRemove?: () => void;
}

export interface CoachPricingModalProps {
  pricingId?: string;
  onSuccess?: () => void;
}

export interface GymInvitationModalProps {
  invitationId: string;
  gymName: string;
  gymId?: string;
}

export interface CreateAnnouncementModalProps {
  gymId: string;
}

export interface LogSessionModalProps {
  activeHistory: ProgramHistory;
  initialSession?: ProgramDayProgress;
  mode: "new" | "edit";
}

export interface ReviewCoachRequestModalProps {
  request: User;
  affiliationId?: string;
  gymId?: string;
  message?: string;
}

export interface EditAppPlanModalProps {
  plan?: AppPlan | null;
}

export interface AdminManagePermissionsModalProps {
  editor: AppEditorUser;
}

export interface AdminCreateEditorModalProps {
  onSuccess?: () => void;
}

export interface ReportDetailsModalProps {
  report: Report;
}

export interface AlertDetailsModalProps {
  alert: Alert;
}

export interface CompetitionModalProps {
  gymId: string;
  competition?: Competition;
  onSuccess?: () => void;
}

export interface ProductModalProps {
  gymId: string;
  product?: Product;
  onSuccess?: () => void;
}

export interface GymMediaModalProps {
  gymId: string;
  type?: "image" | "video" | "document";
  onSuccess?: () => void;
}

export interface UserProfileModalProps {
  user: User;
}

export interface ProductDetailsModalProps {
  product: Product;
}

export interface CompetitionDetailsModalProps {
  competition: Competition;
  gymId?: string;
}

export interface SetWinnersModalProps {
  competition: Competition;
  onSuccess?: () => void;
}

export interface CompetitionParticipantsModalProps {
  competitionId: string;
  gymId: string;
}

export interface ServiceModalProps {
  mode: "create" | "edit";
  service?: GymService;
}

export interface PricingModalProps {
  mode: "create" | "edit";
  plan?: SubscriptionType;
  onSuccess?: () => void;
}

export interface CreateMemberModalProps {
  onSuccess?: () => void;
}

export interface ClassDetailsModalProps {
  gymClass: GymClass;
  onBook?: (id: string) => void;
  onCancel?: (id: string) => void;
  onCancelClass?: (id: string) => void;
  canBook?: boolean;
  isBooking?: boolean;
  isPassed?: boolean;
}
export interface CoachingOfferModalProps {
  requestId: string;
  coachName: string;
  coachId: string;
  coachImageUrl?: string;
  message?: string;
  onSuccess?: () => void;
}

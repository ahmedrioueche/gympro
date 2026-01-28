import type {
  AppPlan,
  CoachProfile,
  EditUserDto,
  Exercise,
  TrainingProgram,
} from "@ahmedrioueche/gympro-client";

export interface ConfirmModalProps {
  text?: string;
  title?: string;
  confirmText?: string;
  confirmVariant?: "danger" | "success" | "primary";
  onConfirm?: () => void;
  onCancel?: () => void;
  verificationText?: string;
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
}

export interface SessionDetailsModalProps {
  session: import("@ahmedrioueche/gympro-client").Session;
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
  coachId: string;
}

export interface CoachPricingModalProps {
  pricingId?: string; // If provided, edit mode; otherwise create mode
  onSuccess?: () => void;
}

export interface GymInvitationModalProps {
  invitationId: string; // The affiliation ID
  gymName: string;
  gymId?: string;
}

export interface CreateAnnouncementModalProps {
  gymId: string;
}

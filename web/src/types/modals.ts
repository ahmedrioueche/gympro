import type {
  AppPlan,
  CoachProfile,
  EditUserDto,
  Exercise,
} from "@ahmedrioueche/gympro-client";

export interface ConfirmModalProps {
  text?: string;
  title?: string;
  confirmText?: string;
  confirmVariant?: "danger" | "success" | "primary";
  onConfirm?: () => void;
  onCancel?: () => void;
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

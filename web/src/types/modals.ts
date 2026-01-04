import type { AppPlan, EditUserDto } from "@ahmedrioueche/gympro-client";

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

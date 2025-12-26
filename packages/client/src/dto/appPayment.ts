import { AppPaymentStatus, AppPaymentWithPlan } from "../types/appPayment";
import { AppPaymentProvider } from "../types/appSubscription";

// DTO for getting a single payment with populated data
export interface GetAppPaymentDto extends AppPaymentWithPlan {
  subscription?: {
    _id: string;
    planId: string;
    billingCycle?: string;
    status: string;
  };
}

// DTO for paginated payments response
export interface GetAppPaymentsResponseDto {
  data: GetAppPaymentDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// DTO for filtering payments
export interface AppPaymentFilterDto {
  page?: number;
  limit?: number;
  search?: string; // Search by transaction ID or description
  status?: AppPaymentStatus;
  provider?: AppPaymentProvider;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  sortBy?: "date" | "amount";
  sortOrder?: "asc" | "desc";
}

// DTO for payment stats
export interface AppPaymentStatsDto {
  totalPayments: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  successRate: number; // Percentage of completed payments
  revenueByProvider: {
    paddle: number;
    chargily: number;
  };
}

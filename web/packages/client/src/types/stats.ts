import { ApiResponse } from "./api";
import { Gym } from "./gym";
import { User } from "./user";

export interface AdminDashboardStats {
  totalUsers: number;
  activeGyms: number;
  totalRevenue: number;
  pendingApprovals: number;
  systemHealth: "healthy" | "degraded" | "maintenance";
  recentUsers: User[];
  recentGyms: Gym[];
}

export interface AdminApi {
  getDashboardStats(): Promise<ApiResponse<AdminDashboardStats>>;
}

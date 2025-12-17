import { UserRole } from "./user";

export interface ApiResponse<T = any> {
  success: boolean;
  errorCode?: string;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

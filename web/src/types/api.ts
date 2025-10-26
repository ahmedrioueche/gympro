export type AvailableLanguages = 'en' | 'fr' | 'ar';

export interface ApiResponse<T = any> {
  data: T;
  statusCode: number;
  success: boolean;
  message?: string;
}

export interface SignInDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface CRUDItem {
  id: string;
  [key: string]: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

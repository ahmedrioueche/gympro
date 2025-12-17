import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "../types/api";
import { ErrorCode, HttpStatusToErrorCode } from "../types/error";
import { getApiClient } from "./config";

export const apiClient = new Proxy({} as AxiosInstance, {
  get: (_, prop) => {
    const client = getApiClient();
    const value = client[prop as keyof AxiosInstance];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export function apiResponse<T>(
  success: boolean,
  errorCode?: string,
  data?: T,
  message?: string
): ApiResponse<T> {
  return { success, errorCode, data, message };
}

export function handleApiError(error: unknown): ApiResponse<null> {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const errorCode =
      (error.response?.data as any)?.errorCode ||
      HttpStatusToErrorCode[status] ||
      ErrorCode.INTERNAL_SERVER_ERROR;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unexpected server error";

    return apiResponse<null>(false, errorCode, null, message);
  }

  // Non-Axios errors
  return apiResponse<null>(
    false,
    ErrorCode.INTERNAL_SERVER_ERROR,
    null,
    "Unexpected error"
  );
}

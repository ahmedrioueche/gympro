import { ErrorCode, type ApiResponse } from "@ahmedrioueche/gympro-client";

export interface StatusMessage {
  status: "success" | "error" | "info" | "warning";
  message: string;
  showToast?: boolean;
}

export interface MessageHandlerConfig {
  t: (key: string) => string;
  showToast?: boolean;
}

// Map ErrorCode to translation keys
const ErrorCodeToTranslationKey: Record<ErrorCode, string> = {
  // Server errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: "status.error.internal_server_error",
  [ErrorCode.NOT_IMPLEMENTED]: "status.error.not_implemented",
  [ErrorCode.TOO_MANY_REQUESTS]: "status.error.too_many_requests",
  [ErrorCode.BAD_GATEWAY]: "status.error.bad_gateway",
  [ErrorCode.SERVICE_UNAVAILABLE]: "status.error.service_unavailable",
  [ErrorCode.GATEWAY_TIMEOUT]: "status.error.gateway_timeout",
  [ErrorCode.METHOD_NOT_ALLOWED]: "status.error.method_not_allowed",

  // Authentication errors
  [ErrorCode.INVALID_CREDENTIALS]: "status.error.auth.invalid_credentials",
  [ErrorCode.ACCOUNT_DEACTIVATED]: "status.error.auth.account_deactivated",
  [ErrorCode.EMAIL_NOT_VERIFIED]: "status.error.auth.email_not_verified",
  [ErrorCode.INVALID_REFRESH_TOKEN]: "status.error.auth.invalid_refresh_token",
  [ErrorCode.NO_TOKEN_PROVIDED]: "status.error.auth.no_token_provided",
  [ErrorCode.INVALID_TOKEN]: "status.error.auth.invalid_token",
  [ErrorCode.USER_ALREADY_EXISTS]: "status.error.auth.user_already_exists",
  [ErrorCode.EMAIL_ALREADY_VERIFIED]:
    "status.error.auth.email_already_verified",
  [ErrorCode.USER_NOT_FOUND]: "status.error.auth.user_not_found",
  [ErrorCode.INVALID_VERIFICATION_TOKEN]:
    "status.error.auth.invalid_verification_token",
  [ErrorCode.EXPIRED_VERIFICATION_TOKEN]:
    "status.error.auth.expired_verification_token",
  [ErrorCode.INVALID_RESET_TOKEN]: "status.error.auth.invalid_reset_token",
  [ErrorCode.EXPIRED_RESET_TOKEN]: "status.error.auth.expired_reset_token",
  [ErrorCode.GOOGLE_AUTH_FAILED]: "status.error.auth.google_auth_failed",
  [ErrorCode.GOOGLE_USER_INFO_FAILED]:
    "status.error.auth.google_user_info_failed",

  // User errors
  [ErrorCode.USER_NOT_FOUND_USER]: "status.error.user.not_found",
  [ErrorCode.EMAIL_ALREADY_IN_USE]: "status.error.user.email_already_in_use",
  [ErrorCode.USERNAME_ALREADY_IN_USE]:
    "status.error.user.username_already_in_use",
  [ErrorCode.INVALID_USER_DATA]: "status.error.user.invalid_data",
  [ErrorCode.CANNOT_UPDATE_EMAIL]: "status.error.user.cannot_update_email",
  [ErrorCode.INVALID_ROLE]: "status.error.user.invalid_role",
  [ErrorCode.CANNOT_CHANGE_OWN_ROLE]:
    "status.error.user.cannot_change_own_role",
  [ErrorCode.INSUFFICIENT_PERMISSIONS]:
    "status.error.user.insufficient_permissions",
  [ErrorCode.USER_ALREADY_ACTIVE]: "status.error.user.already_active",
  [ErrorCode.USER_ALREADY_DEACTIVATED]: "status.error.user.already_deactivated",
  [ErrorCode.CANNOT_DEACTIVATE_SELF]:
    "status.error.user.cannot_deactivate_self",
  [ErrorCode.INVALID_PROFILE_DATA]: "status.error.user.invalid_profile_data",
  [ErrorCode.PROFILE_UPDATE_FAILED]: "status.error.user.profile_update_failed",

  [ErrorCode.GYM_NOT_FOUND]: "status.error.gym.not_found",
  [ErrorCode.CREATE_GYM_FAILED]: "status.error.gym.create_failed",
  [ErrorCode.FETCH_GYMS_FAILED]: "status.error.gym.fetch_failed",
  [ErrorCode.FETCH_MY_GYMS_FAILED]: "status.error.gym.fetch_my_failed",
  [ErrorCode.FETCH_MEMBER_GYMS_FAILED]: "status.error.gym.fetch_member_failed",
  [ErrorCode.FETCH_ALL_MY_GYMS_FAILED]: "status.error.gym.fetch_all_my_failed",
  [ErrorCode.UPDATE_GYM_FAILED]: "status.error.gym.update_failed",
  [ErrorCode.DELETE_GYM_FAILED]: "status.error.gym.delete_failed",
};

/**
 * Get a user-friendly message from an API response
 * @param response - The API response
 * @param config - Configuration with translation function
 * @returns StatusMessage object with status, message, and toast flag
 */
export const getMessage = <T = any>(
  response: ApiResponse<T>,
  config: MessageHandlerConfig
): StatusMessage => {
  const { t, showToast = true } = config;

  // Success case
  if (response.success) {
    const message = response.message || t("status.success.operation_completed");
    return {
      status: "success",
      message,
      showToast,
    };
  }

  // Error case
  if (response.errorCode) {
    const translationKey =
      ErrorCodeToTranslationKey[response.errorCode as ErrorCode];

    if (translationKey) {
      return {
        status: "error",
        message: t(translationKey),
        showToast,
      };
    }
  }

  // Fallback to response message or generic error
  const fallbackMessage = response.message || t("status.error.unexpected");
  return {
    status: "error",
    message: fallbackMessage,
    showToast,
  };
};

/**
 * Show toast notification based on StatusMessage
 * @param statusMessage - The status message object
 * @param toast - Toast notification library instance
 */
export const showStatusToast = (
  statusMessage: StatusMessage,
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info?: (msg: string) => void;
    warning?: (msg: string) => void;
  }
) => {
  if (!statusMessage.showToast) return;

  const { status, message } = statusMessage;

  switch (status) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info?.(message);
      break;
    case "warning":
      toast.warning?.(message);
      break;
  }
};

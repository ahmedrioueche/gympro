import { ErrorCode, type ApiResponse } from '@ahmedrioueche/gympro-client';

export interface StatusMessage {
  status: 'success' | 'error' | 'info' | 'warning';
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
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'error.internal_server_error',
  [ErrorCode.NOT_IMPLEMENTED]: 'error.not_implemented',
  [ErrorCode.TOO_MANY_REQUESTS]: 'error.too_many_requests',
  [ErrorCode.BAD_GATEWAY]: 'error.bad_gateway',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'error.service_unavailable',
  [ErrorCode.GATEWAY_TIMEOUT]: 'error.gateway_timeout',
  [ErrorCode.METHOD_NOT_ALLOWED]: 'error.method_not_allowed',

  // Authentication errors
  [ErrorCode.INVALID_CREDENTIALS]: 'error.auth.invalid_credentials',
  [ErrorCode.ACCOUNT_DEACTIVATED]: 'error.auth.account_deactivated',
  [ErrorCode.EMAIL_NOT_VERIFIED]: 'error.auth.email_not_verified',
  [ErrorCode.INVALID_REFRESH_TOKEN]: 'error.auth.invalid_refresh_token',
  [ErrorCode.NO_TOKEN_PROVIDED]: 'error.auth.no_token_provided',
  [ErrorCode.INVALID_TOKEN]: 'error.auth.invalid_token',
  [ErrorCode.USER_ALREADY_EXISTS]: 'error.auth.user_already_exists',
  [ErrorCode.EMAIL_ALREADY_VERIFIED]: 'error.auth.email_already_verified',
  [ErrorCode.USER_NOT_FOUND]: 'error.auth.user_not_found',
  [ErrorCode.INVALID_VERIFICATION_TOKEN]: 'error.auth.invalid_verification_token',
  [ErrorCode.EXPIRED_VERIFICATION_TOKEN]: 'error.auth.expired_verification_token',
  [ErrorCode.INVALID_RESET_TOKEN]: 'error.auth.invalid_reset_token',
  [ErrorCode.EXPIRED_RESET_TOKEN]: 'error.auth.expired_reset_token',
  [ErrorCode.GOOGLE_AUTH_FAILED]: 'error.auth.google_auth_failed',
  [ErrorCode.GOOGLE_USER_INFO_FAILED]: 'error.auth.google_user_info_failed',

  // User errors
  [ErrorCode.USER_NOT_FOUND_USER]: 'error.user.not_found',
  [ErrorCode.EMAIL_ALREADY_IN_USE]: 'error.user.email_already_in_use',
  [ErrorCode.USERNAME_ALREADY_IN_USE]: 'error.user.username_already_in_use',
  [ErrorCode.INVALID_USER_DATA]: 'error.user.invalid_data',
  [ErrorCode.CANNOT_UPDATE_EMAIL]: 'error.user.cannot_update_email',
  [ErrorCode.INVALID_ROLE]: 'error.user.invalid_role',
  [ErrorCode.CANNOT_CHANGE_OWN_ROLE]: 'error.user.cannot_change_own_role',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'error.user.insufficient_permissions',
  [ErrorCode.USER_ALREADY_ACTIVE]: 'error.user.already_active',
  [ErrorCode.USER_ALREADY_DEACTIVATED]: 'error.user.already_deactivated',
  [ErrorCode.CANNOT_DEACTIVATE_SELF]: 'error.user.cannot_deactivate_self',
  [ErrorCode.INVALID_PROFILE_DATA]: 'error.user.invalid_profile_data',
  [ErrorCode.PROFILE_UPDATE_FAILED]: 'error.user.profile_update_failed',
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
    const message = response.message || t('status.success.operation_completed');
    return {
      status: 'success',
      message,
      showToast,
    };
  }

  // Error case
  if (response.errorCode) {
    const translationKey = ErrorCodeToTranslationKey[response.errorCode as ErrorCode];

    if (translationKey) {
      return {
        status: 'error',
        message: t(translationKey),
        showToast,
      };
    }
  }

  // Fallback to response message or generic error
  const fallbackMessage = response.message || t('status.error.unexpected');
  return {
    status: 'error',
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
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'info':
      toast.info?.(message);
      break;
    case 'warning':
      toast.warning?.(message);
      break;
  }
};

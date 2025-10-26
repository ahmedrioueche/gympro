export interface StatusMessage {
  status: "success" | "error" | "info" | "warning";
  message: string;
  showToast?: boolean;
}

export interface StatusCodeHandlerConfig {
  t: (key: string) => string;
  showToast?: boolean;
}

export const getMessageByStatuscode = (
  statusCode: number,
  config: StatusCodeHandlerConfig
): StatusMessage => {
  let { t, showToast = true } = config;

  let status: "success" | "error" | "info" | "warning" = "info";
  let message = "";

  if (!statusCode) {
    status = "success";
    showToast = false;
    return { status, message, showToast };
  }

  switch (statusCode) {
    case 200:
    case 201:
      status = "success";
      message = t("status.success.operation_completed");
      break;
    case 400:
      status = "error";
      message = t("status.error.bad_request");
      break;
    case 401:
      status = "error";
      message = t("status.error.unauthorized");
      break;
    case 403:
      status = "error";
      message = t("status.error.forbidden");
      break;
    case 404:
      status = "error";
      message = t("status.error.not_found");
      break;
    case 409:
      status = "error";
      message = t("status.error.conflict");
      break;
    case 500:
      status = "error";
      message = t("status.error.server_error");
      break;
    case 503:
      status = "error";
      message = t("status.error.service_unavailable");
      break;
    default:
      if (statusCode >= 200 && statusCode < 300) {
        status = "success";
        message = t("status.success.default");
      } else if (statusCode >= 400 && statusCode < 500) {
        status = "error";
        message = t("status.error.client_default");
      } else if (statusCode >= 500) {
        status = "error";
        message = t("status.error.server_default");
      }
  }

  return { status, message, showToast };
};

// Helper function to show the toast (to be called in components)
export const showStatusToast = (
  statusMessage: StatusMessage,
  toast: { success: (msg: string) => void; error: (msg: string) => void }
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
  }
};

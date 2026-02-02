export enum AlertType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
}

export enum AlertPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum AlertStatus {
  UNREAD = "unread",
  READ = "read",
  RESOLVED = "resolved",
}

export enum AlertSource {
  INTERNAL = "internal",
  SENTRY = "sentry",
  PINO = "pino",
}

export interface Alert {
  _id: string;
  title: string;
  message: string;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  source: AlertSource;
  stackTrace?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAlertStatusDto {
  status: AlertStatus;
}

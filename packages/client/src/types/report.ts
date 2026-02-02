import { User } from "./user";

export enum ReportType {
  ISSUE = "issue",
  FEEDBACK = "feedback",
  FEATURE_REQUEST = "feature_request",
}

export enum ReportPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum ReportStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export interface Report {
  _id: string;
  subject: string;
  description: string;
  type: ReportType;
  priority: ReportPriority;
  status: ReportStatus;
  reporter: User | string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportDto {
  subject: string;
  description: string;
  type: ReportType;
  priority?: ReportPriority;
  metadata?: Record<string, any>;
}

export interface UpdateReportStatusDto {
  status: ReportStatus;
}

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

export interface ReportResponse {
  _id?: string;
  sender: User | string;
  message: string;
  attachments: string[];
  createdAt: string;
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
  attachments?: string[];
  responses?: ReportResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportDto {
  subject: string;
  description: string;
  type: ReportType;
  priority?: ReportPriority;
  metadata?: Record<string, any>;
  attachments?: string[];
}

export interface AddReportResponseDto {
  message: string;
  attachments?: string[];
}

export interface UpdateReportStatusDto {
  status: ReportStatus;
}

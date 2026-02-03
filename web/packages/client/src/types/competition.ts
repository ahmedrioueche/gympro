import { AuditInfo } from "./common";

export const COMPETITION_TYPES = [
  "weightlifting",
  "cardio",
  "attendance",
  "steps",
  "weight_loss",
  "custom",
] as const;

export const COMPETITION_STATUSES = [
  "draft",
  "active",
  "completed",
  "cancelled",
] as const;

export type CompetitionType = (typeof COMPETITION_TYPES)[number];
export type CompetitionStatus = (typeof COMPETITION_STATUSES)[number];

export interface Competition extends AuditInfo {
  _id: string;
  gymId: string;
  title: string;
  description: string;
  type: CompetitionType;
  status: CompetitionStatus;
  startDate: string | Date;
  endDate: string | Date;
  rules?: string;
  prize?: string;
  bannerImage?: string;
  maxParticipants?: number;
  participantCount: number;
}

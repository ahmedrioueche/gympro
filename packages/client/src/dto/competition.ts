import {
  CompetitionSchedulingMode,
  CompetitionStatus,
  CompetitionType,
} from "../types/competition";

export interface CreateCompetitionDto {
  title: string;
  description: string;
  type: CompetitionType;
  schedulingMode?: CompetitionSchedulingMode;
  startDate: string | Date;
  endDate?: string | Date;
  eventTime?: string | Date;
  rules?: string;
  prize?: string;
  bannerImage?: string;
  maxParticipants?: number;
}

export interface UpdateCompetitionDto extends Partial<CreateCompetitionDto> {
  status?: CompetitionStatus;
}

export interface CompetitionQueryDto {
  search?: string;
  type?: CompetitionType;
  status?: CompetitionStatus;
  page?: number;
  limit?: number;
}

// Request coach services DTO
export interface RequestCoachDto {
  message?: string;
}

// Coach query filters
export interface CoachQueryDto {
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  limit?: number;
  offset?: number;
}

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

// Respond to coaching request DTO
export interface RespondToRequestDto {
  action: "accept" | "decline";
  response?: string;
}

// Send coaching request to member DTO
export interface SendCoachRequestDto {
  message?: string;
}

// Prospective members query filters
export interface ProspectiveMembersQueryDto {
  gymId?: string;
  city?: string;
  state?: string;
  country?: string;
  limit?: number;
  offset?: number;
}

export interface GymAnnouncement {
  _id: string;
  gymId: string;
  title: string;
  content: string;
  priority: "normal" | "high" | "critical";
  targetAudience: "all" | "members" | "staff";
  isActive: boolean;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementDto {
  gymId: string;
  title: string;
  content: string;
  priority: "normal" | "high" | "critical";
  targetAudience: "all" | "members" | "staff";
  isActive?: boolean;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  priority?: "normal" | "high" | "critical";
  targetAudience?: "all" | "members" | "staff";
  isActive?: boolean;
}
